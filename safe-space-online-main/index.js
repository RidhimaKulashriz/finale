#!/usr/bin/env node

// This is a fallback entry point for Railway deployment
// It ensures Railway can find a start command

require('child_process').execSync('cd backend && npm run build && npm start', { stdio: 'inherit' });
