#!/usr/bin/env node
const { spawn } = require('child_process');

// Set env vars to reduce Contentlayer activity on Windows
process.env.CONTENTLAYER_SKIP_TYPEGEN = '1';
process.env.CONTENTLAYER_HIDE_WARNING = '1';
// Tell root config to skip applying Contentlayer wrapper
process.env.SKIP_CONTENTLAYER = '1';

const cmd = process.execPath; // node
const args = [require.resolve('next/dist/bin/next'), 'dev'];

const p = spawn(cmd, args, { stdio: 'inherit', env: process.env });

p.on('close', (code) => process.exit(code));
