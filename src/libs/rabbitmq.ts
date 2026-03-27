import * as amqp from 'amqplib';
import { AppConfig } from '../config/app-config';

const RABBITMQ_URL = AppConfig.RABBITMQ.URL;

interface RabbitMQConnection extends amqp.Connection {
  createChannel(): Promise<amqp.Channel>;
}

let connection: RabbitMQConnection | null = null;
let channel: amqp.Channel | null = null;
const assertedQueues = new Set<string>();

export const RabbitMQUtil = {
  async connect() {
    if (connection && channel) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      connection = (await amqp.connect(RABBITMQ_URL)) as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      channel = await (connection as any).createChannel();

      connection.on('error', (err) => {
        console.error('RabbitMQ connection error', err);
        connection = null;
        channel = null;
        assertedQueues.clear();
      });

      connection.on('close', () => {
        console.warn('RabbitMQ connection closed');
        connection = null;
        channel = null;
        assertedQueues.clear();
      });

      console.log('Connected to RabbitMQ');
    } catch (error) {
      console.error('Failed to connect to RabbitMQ', error);
    }
  },

  async publish(routingKey: string, message: Record<string, unknown>) {
    if (!channel) await this.connect();
    if (!channel) {
      console.error('RabbitMQ channel not available, skipping message');
      return;
    }

    try {
      if (!assertedQueues.has(routingKey)) {
        await channel.assertQueue(routingKey, { durable: true });
        assertedQueues.add(routingKey);
      }
      channel.sendToQueue(routingKey, Buffer.from(JSON.stringify(message)), { persistent: true });
      console.log(`[x] Sent event to ${routingKey}`);
    } catch (error) {
      console.error('Error sending message to RabbitMQ', error);
      // Invalidate cache on error to retry assertion next time
      assertedQueues.delete(routingKey);
    }
  }
};
