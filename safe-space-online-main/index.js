#!/usr/bin/env node

// This is a fallback entry point for Railway deployment
// It ensures Railway can find a start command

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Starting application...');

try {
  // Run the build and start commands
  console.log('🔨 Building and starting the application...');
  
  // Change to the backend directory and run build and start
  process.chdir(join(__dirname, 'backend'));
  
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('🔨 Building the application...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('🚀 Starting the server...');
  execSync('npm start', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Failed to start the application:', error);
  process.exit(1);
}
