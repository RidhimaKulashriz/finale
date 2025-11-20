/* eslint-disable no-console */
import app from './app';

// Configuration
const PORT = Number(process.env.PORT) || 8000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Validate port
if (isNaN(PORT) || PORT < 1 || PORT > 65535) {
  console.error(`❌ Invalid port: ${PORT}. Must be 1-65535`);
  process.exit(1);
}

// Create HTTP server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Backend server running in ${NODE_ENV} mode`);
  console.log(`📡 API: http://localhost:${PORT}/api/v1`);
  console.log(`🩺 Health: http://localhost:${PORT}/api/v1/health`);
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

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: unknown) => {
  console.error('💥 Unhandled Rejection:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('💥 Uncaught Exception:', error);
  process.exit(1);
});

// Graceful shutdown handler
const shutdown = (signal: string) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);

  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });

  // Force shutdown after timeout
  setTimeout(() => {
    console.error('❌ Could not close connections in time, forcing shutdown');
    process.exit(1);
  }, 10000);
};

// Handle process signals
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Export for testing
if (process.env.NODE_ENV === 'test') {
  module.exports = { server, shutdown };
}
