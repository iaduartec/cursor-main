#!/usr/bin/env node

// Script de build personalizado para manejar variables de entorno
// en diferentes plataformas (Windows y Vercel/Linux)

// No desactivar DB ni Contentlayer en Vercel. En local (especialmente Windows)
// aplicamos valores por defecto seguros salvo que el usuario los haya definido.
const isVercel = process.env.VERCEL === '1';
if (!isVercel) {
    if (process.env.SKIP_DB === undefined) {
        // Evita conexiones DB durante builds locales por defecto
        process.env.SKIP_DB = '1';
    }
    if (process.env.SKIP_CONTENTLAYER === undefined) {
        // Contentlayer suele dar problemas en Windows; desactívalo por defecto
        process.env.SKIP_CONTENTLAYER = '1';
    }
}

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