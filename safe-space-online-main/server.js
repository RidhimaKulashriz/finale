#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import process from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use port from environment or default to 5001
const PORT = process.env.PORT || 5001;
const backendPath = join(__dirname, 'backend');

console.log('🚀 Starting application...');
console.log(`📡 Root server will run on port: ${PORT}`);

// Build the backend
console.log('🔨 Building backend...');
const buildProcess = spawn('npm', ['run', 'build'], {
  cwd: backendPath,
  stdio: 'inherit',
  shell: true
});

buildProcess.on('close', (code) => {
  if (code !== 0) {
    console.error('❌ Backend build failed');
    process.exit(1);
  }
  
  console.log('✅ Backend built successfully');
  startBackend();
});

function startBackend() {
  console.log('🚀 Starting backend server...');
  
  // Start the backend server directly from dist
  const serverProcess = spawn('node', ['dist/server.js'], {
    cwd: backendPath,
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      PORT: PORT,
      NODE_ENV: process.env.NODE_ENV || 'production'
    }
  });

  serverProcess.on('error', (err) => {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  });

  // Handle process termination
  const handleExit = (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    serverProcess.kill();
    process.exit(0);
  };

  process.on('SIGINT', handleExit);
  process.on('SIGTERM', handleExit);
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  console.error('💥 Unhandled Rejection:', reason);
});
