/* eslint-disable no-console */
import app from './app';
import mongoose from 'mongoose';
import { env } from './config/env';

// Configuration
const PORT = Number(process.env.PORT) || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Validate port
if (isNaN(PORT) || PORT < 1 || PORT > 65535) {
  console.error(`❌ Invalid port: ${PORT}. Must be 1-65535`);
  process.exit(1);
}

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: env.DB_MAX_POOL_SIZE,
      minPoolSize: env.DB_MIN_POOL_SIZE,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`\n🚀 Backend server running in ${NODE_ENV} mode`);
      console.log(`📡 API: http://localhost:${PORT}${env.API_PREFIX}`);
      console.log(`🩺 Health: http://localhost:${PORT}${env.API_PREFIX}/health`);
      console.log(`🕒 ${new Date().toISOString()}\n`);
    });

    // Handle server errors
    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.syscall !== 'listen') throw error;

      switch (error.code) {
        case 'EACCES':
          console.error(`❌ Port ${PORT} requires elevated privileges`);
          break;
        case 'EADDRINUSE':
          console.error(`❌ Port ${PORT} is already in use`);
          break;
        default:
          console.error('❌ Server error:', error);
      }
      process.exit(1);
    });

    // Graceful shutdown handler
    const shutdown = async (signal: string) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);

      try {
        await mongoose.connection.close();
        console.log('✅ MongoDB connection closed');

        server.close(() => {
          console.log('✅ HTTP server closed');
          process.exit(0);
        });

        // Force shutdown after timeout
        setTimeout(() => {
          console.error('❌ Could not close connections in time, forcing shutdown');
          process.exit(1);
        }, 10000);
      } catch (error) {
        console.error('❌ Error during shutdown:', error);
        process.exit(1);
      }
    };

    // Handle process signals
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    return { server, shutdown };
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

// Export for testing
if (process.env.NODE_ENV === 'test') {
  module.exports = { startServer, connectDB };
}
