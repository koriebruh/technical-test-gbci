import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Auth Service API',
      version: '1.0.0',
      description: 'User authentication and profile management API with RabbitMQ event publishing',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
      license: {
        name: 'MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authentication token from login endpoint',
        },
        userIdHeader: {
          type: 'apiKey',
          in: 'header',
          name: 'x-user-id',
          description: 'User ID from authentication (injected by gateway/middleware)',
        },
        correlationIdHeader: {
          type: 'apiKey',
          in: 'header',
          name: 'x-correlation-id',
          description: 'Trace ID for request tracking',
        },
      },
    },
    security: [
      {
        correlationIdHeader: [],
      },
    ],
  },
  apis: [
    './src/app/api/**/*.ts',
    './src/dtos/**/*.ts'
  ],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);


