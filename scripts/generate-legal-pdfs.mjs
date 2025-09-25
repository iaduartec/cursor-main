#!/usr/bin/env node

/**
 * Script para generar PDFs de las políticas legales
 * 
 * Genera archivos PDF profesionales a partir de las páginas web de políticas legales
 * para que estén disponibles en formato descargable desde:
 * - https://www.duartec.es/privacidad.pdf
 * - https://www.duartec.es/politicadecookies.pdf
 * 
 * @author Duartec Instalaciones Informáticas
 * @version 1.0.0
 * @date 2025-09-26
 */

import puppeteer from 'puppeteer';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://www.duartec.es'
  : 'http://localhost:3000';

const OUTPUT_DIR = join(process.cwd(), 'public');

// Asegurar que el directorio de salida existe
if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function generatePDF(url, outputPath, title) {
  console.log(`🔄 Generando PDF: ${title}...`);
  
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run'
      ]
    });
    
    const page = await browser.newPage();
    
    // Configurar viewport y user agent
    await page.setViewport({ width: 1200, height: 800 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    // Navegar a la página
    console.log(`📄 Navegando a: ${url}`);
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 15000 
    });
    
    // Esperar un momento adicional para asegurar que todo esté cargado
    await page.waitForTimeout(2000);
    
    // Generar PDF con configuración optimizada
    await page.pdf({
      path: outputPath,
      format: 'A4',
      margin: {
        top: '2cm',
        right: '1.5cm',
        bottom: '2cm',
        left: '1.5cm'
      },
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="font-size: 9px; margin: 0 auto; color: #666; text-align: center; width: 100%; padding: 5px 0; border-bottom: 1px solid #eee;">
          <strong>${title}</strong>
          <span style="float: right; margin-right: 20px;">${new Date().toLocaleDateString('es-ES')}</span>
        </div>
      `,
      footerTemplate: `
        <div style="font-size: 9px; margin: 0 auto; color: #555; text-align: center; width: 100%; padding: 5px 0;">
          <span>Duartec Instalaciones Informáticas</span>
          <span style="margin: 0 15px;">•</span>
          <span>info@duartec.es</span>
          <span style="margin: 0 15px;">•</span>
          <span>947 256 430</span>
          <span style="margin: 0 15px;">•</span>
          <span>Burgos, España</span>
          <span style="float: right; margin-right: 20px;">Página <span class="pageNumber"></span> de <span class="totalPages"></span></span>
        </div>
      `
    });
    
    console.log(`✅ PDF generado: ${outputPath}`);
    
  } catch (error) {
    console.error(`❌ Error generando PDF ${title}:`, error.message);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

async function main() {
  console.log('🚀 Iniciando generación de PDFs legales...\n');
  console.log(`📍 Base URL: ${BASE_URL}`);
  console.log(`📁 Output Dir: ${OUTPUT_DIR}\n`);
  
  const pdfs = [
    {
      url: `file:///${join(process.cwd(), 'public', 'privacidad-temp.html').replace(/\\/g, '/')}`,
      outputPath: join(OUTPUT_DIR, 'privacidad.pdf'),
      title: 'Política de Privacidad - Duartec Instalaciones Informáticas'
    },
    {
      url: `file:///${join(process.cwd(), 'public', 'politicadecookies-temp.html').replace(/\\/g, '/')}`,
      outputPath: join(OUTPUT_DIR, 'politicadecookies.pdf'),
      title: 'Política de Cookies - Duartec Instalaciones Informáticas'
    }
  ];
  
  try {
    for (const pdf of pdfs) {
      await generatePDF(pdf.url, pdf.outputPath, pdf.title);
      console.log(`📄 Archivo creado: ${pdf.outputPath}\n`);
    }
    
    console.log('\n🎉 Todos los PDFs generados exitosamente!');
    console.log('📂 Archivos disponibles en:');
    console.log(`   - https://www.duartec.es/privacidad.pdf`);
    console.log(`   - https://www.duartec.es/politicadecookies.pdf`);
    
  } catch (error) {
    console.error('💥 Error en la generación de PDFs:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { generatePDF };