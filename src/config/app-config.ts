export const AppConfig = {
    APP: {
        NAME: process.env.APP_NAME || "technical_test_gbci",
        VERSION: process.env.APP_VERSION || "1.0.0",
    },
    JWT: {
        ACCESS_EXPIRATION_TIME: process.env.JWT_ACCESS_EXPIRATION_TIME || "15m",
        REFRESH_EXPIRATION_TIME: process.env.JWT_REFRESH_EXPIRATION_TIME || "7d",
    },
    SECURITY: {
        SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS || "12", 10) || 12, // Fallback if NaN
    },
    MONGO: {
        URI: process.env.MONGODB_URI,
    },
    RABBITMQ: {
        URL: process.env.RABBITMQ_URL || "amqp://localhost:5672",
    },
};

// Validate essential configurations
if (!AppConfig.MONGO.URI) {
    throw new Error("MONGODB_URI is not defined in .env");
}
