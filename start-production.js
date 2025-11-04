#!/usr/bin/env node

/**
 * Production Start Script for RapBots AI
 * 
 * This script ensures NODE_ENV=production is set before starting the server.
 * It's specifically designed for Replit Autoscale deployments.
 * 
 * Usage: node start-production.js
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Force NODE_ENV to production
process.env.NODE_ENV = 'production';

console.log('🚀 RapBots AI - Production Startup Script');
console.log('=' .repeat(60));
console.log(`📅 Started: ${new Date().toISOString()}`);
console.log(`🔧 NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`📁 Working Directory: ${process.cwd()}`);

// Verify build exists
const distPath = join(__dirname, 'dist');
const distIndexPath = join(distPath, 'index.js');
const distPublicPath = join(distPath, 'public');

console.log('\n🔍 Pre-flight Checks:');

if (!fs.existsSync(distPath)) {
  console.error('❌ FATAL: dist/ directory not found');
  console.error('💡 Run "npm run build" before starting production server');
  process.exit(1);
}
console.log('✅ dist/ directory exists');

if (!fs.existsSync(distIndexPath)) {
  console.error('❌ FATAL: dist/index.js not found');
  console.error('💡 Run "npm run build" to create backend bundle');
  process.exit(1);
}
console.log('✅ dist/index.js exists');

if (!fs.existsSync(distPublicPath)) {
  console.error('❌ FATAL: dist/public/ directory not found');
  console.error('💡 Run "npm run build" to create frontend bundle');
  process.exit(1);
}
console.log('✅ dist/public/ exists');

// Check for index.html
const indexHtmlPath = join(distPublicPath, 'index.html');
if (!fs.existsSync(indexHtmlPath)) {
  console.error('❌ FATAL: dist/public/index.html not found');
  console.error('💡 Frontend build may have failed');
  process.exit(1);
}
console.log('✅ dist/public/index.html exists');

// List contents for debugging
const publicContents = fs.readdirSync(distPublicPath);
console.log(`📂 dist/public contains: ${publicContents.join(', ')}`);

// Check critical environment variables
console.log('\n🔐 Environment Variables:');
const criticalVars = ['DATABASE_URL', 'PORT'];
const optionalVars = ['GROQ_API_KEY', 'ELEVENLABS_API_KEY', 'OPENAI_API_KEY', 'CIRCLE_API_KEY'];

let hasAllCritical = true;
for (const varName of criticalVars) {
  const exists = !!process.env[varName];
  console.log(`${exists ? '✅' : '❌'} ${varName}: ${exists ? 'set' : 'MISSING'}`);
  if (!exists) hasAllCritical = false;
}

console.log('\n🔑 Optional API Keys:');
for (const varName of optionalVars) {
  const exists = !!process.env[varName];
  console.log(`${exists ? '✅' : '⚪'} ${varName}: ${exists ? 'set' : 'not set'}`);
}

if (!hasAllCritical) {
  console.warn('\n⚠️  WARNING: Some critical environment variables are missing');
  console.warn('💡 The server may not function correctly');
}

console.log('\n🎯 Starting Production Server...');
console.log('=' .repeat(60));
console.log('');

// Start the production server with NODE_ENV=production
const server = spawn('node', [distIndexPath], {
  env: {
    ...process.env,
    NODE_ENV: 'production', // Explicitly set again
  },
  stdio: 'inherit', // Pass through stdout/stderr
  shell: false
});

// Handle server process events
server.on('error', (error) => {
  console.error('\n❌ FATAL: Failed to start server');
  console.error(error);
  process.exit(1);
});

server.on('exit', (code, signal) => {
  if (code !== 0) {
    console.error(`\n❌ Server exited with code ${code}`);
    if (signal) {
      console.error(`   Signal: ${signal}`);
    }
    process.exit(code || 1);
  } else {
    console.log('\n✅ Server exited gracefully');
    process.exit(0);
  }
});

// Handle shutdown signals
const shutdown = (signal) => {
  console.log(`\n⚠️  Received ${signal}, shutting down gracefully...`);
  server.kill(signal);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Keep the process alive
process.stdin.resume();
