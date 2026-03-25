import * as amqp from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';

interface RabbitMQConnection extends amqp.Connection {
  createChannel(): Promise<amqp.Channel>;
}

let connection: RabbitMQConnection | null = null;
let channel: amqp.Channel | null = null;

export const RabbitMQUtil = {
  async connect() {
    if (connection && channel) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      connection = (await amqp.connect(RABBITMQ_URL)) as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      channel = await (connection as any).createChannel();
      console.log('Connected to RabbitMQ');
    } catch {
      console.error('Failed to connect to RabbitMQ');
    }
  },

  async publish(routingKey: string, message: Record<string, unknown>) {
    if (!channel) await this.connect();
    if (!channel) return;

    try {
      await channel.assertQueue(routingKey, { durable: true });
      channel.sendToQueue(routingKey, Buffer.from(JSON.stringify(message)), { persistent: true });
      console.log(`[x] Sent event to ${routingKey}`);
    } catch {
      console.error('Error sending message to RabbitMQ');
    }
  }
};
