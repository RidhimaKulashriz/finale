#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Change to backend directory and start the backend
const backendPath = path.join(__dirname, 'backend');
const child = spawn('npm', ['run', 'build'], {
  cwd: backendPath,
  stdio: 'inherit',
  shell: true
});

child.on('close', (code) => {
  if (code === 0) {
    // Build succeeded, now start the server
    const server = spawn('npm', ['start'], {
      cwd: backendPath,
      stdio: 'inherit',
      shell: true
    });
    
    server.on('error', (err) => {
      console.error('Failed to start server:', err);
      process.exit(1);
    });
  } else {
    console.error('Build failed');
    process.exit(1);
  }
});

child.on('error', (err) => {
  console.error('Failed to build:', err);
  process.exit(1);
});
