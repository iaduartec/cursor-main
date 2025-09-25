// Placeholder para imagen OpenGraph por defecto
import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const createDefaultOGImage = async () => {
  const width = 1200;
  const height = 630;
  
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1e40af;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)"/>
      <text x="50%" y="40%" dominant-baseline="middle" text-anchor="middle" 
            font-family="Arial, sans-serif" font-size="64" font-weight="bold" fill="white">
        Duartec
      </text>
      <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle"
            font-family="Arial, sans-serif" font-size="32" fill="rgba(255,255,255,0.9)">
        Instalaciones Informáticas
      </text>
      <text x="50%" y="70%" dominant-baseline="middle" text-anchor="middle"
            font-family="Arial, sans-serif" font-size="24" fill="rgba(255,255,255,0.8)">
        Burgos • Castilla y León
      </text>
    </svg>
  `;

  const outputPath = path.join(path.dirname(__dirname), 'public', 'images', 'og-default.webp');
  
  try {
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    
    await sharp(Buffer.from(svg))
      .webp({ quality: 85 })
      .toFile(outputPath);
      
    console.log('✅ Imagen OpenGraph por defecto creada:', outputPath);
  } catch (error) {
    console.error('❌ Error creando imagen OpenGraph:', error);
  }
};

// Solo ejecutar si se llama directamente
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  createDefaultOGImage();
}

export { createDefaultOGImage };