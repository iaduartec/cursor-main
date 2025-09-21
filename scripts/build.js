#!/usr/bin/env node

// Script de build personalizado para manejar variables de entorno
// en diferentes plataformas (Windows y Vercel/Linux)

process.env.SKIP_DB = '1';
process.env.SKIP_CONTENTLAYER = '1';

// Ejecutar Next.js build
const { spawn } = require('child_process');

const nextBuild = spawn('next', ['build'], {
    stdio: 'inherit',
    shell: true
});

nextBuild.on('close', (code) => {
    process.exit(code);
});

nextBuild.on('error', (error) => {
    console.error('Error ejecutando next build:', error);
    process.exit(1);
});