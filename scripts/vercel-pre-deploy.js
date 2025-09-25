#!/usr/bin/env node
/**
 * Script de verificación pre-deploy para Vercel
 * Valida que todo esté listo para el despliegue
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Verificación Pre-Deploy para Vercel');
console.log('=====================================\n');

let allChecks = [];

function checkFile(filePath, description) {
  const exists = fs.existsSync(filePath);
  allChecks.push({ description, status: exists });
  console.log(`${exists ? '✅' : '❌'} ${description}`);
  return exists;
}

function runCommand(command, description, allowFailure = false) {
  try {
    execSync(command, { stdio: 'pipe' });
    allChecks.push({ description, status: true });
    console.log(`✅ ${description}`);
    return true;
  } catch (error) {
    allChecks.push({ description, status: false });
    console.log(`${allowFailure ? '⚠️' : '❌'} ${description}`);
    if (!allowFailure) {
      console.log(`   Error: ${error.message.split('\n')[0]}`);
    }
    return false;
  }
}

function checkPackageJson() {
  const packagePath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packagePath)) return false;
  
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  const hasNodeVersion = packageJson.engines && packageJson.engines.node;
  const hasBuildScript = packageJson.scripts && packageJson.scripts.build;
  const hasPackageManager = packageJson.packageManager;
  
  allChecks.push({ description: 'Node.js version in engines', status: hasNodeVersion });
  allChecks.push({ description: 'Build script defined', status: hasBuildScript });
  allChecks.push({ description: 'Package manager specified', status: hasPackageManager });
  
  console.log(`${hasNodeVersion ? '✅' : '❌'} Node.js version in engines`);
  console.log(`${hasBuildScript ? '✅' : '❌'} Build script defined`);  
  console.log(`${hasPackageManager ? '✅' : '❌'} Package manager specified`);
  
  return hasNodeVersion && hasBuildScript && hasPackageManager;
}

// Verificaciones de archivos críticos
console.log('📁 Archivos de Configuración:');
checkFile('package.json', 'package.json existe');
checkFile('vercel.json', 'vercel.json configurado');
checkFile('next.config.mjs', 'Next.js config presente');
checkFile('pnpm-lock.yaml', 'Lockfile para reproducibilidad');
checkFile('.env.vercel-import', 'Template de variables de entorno');

console.log('\n📦 Package.json Configuration:');
checkPackageJson();

console.log('\n🔨 Build Process:');
runCommand('pnpm type-check', 'TypeScript compilation', true);
runCommand('pnpm test', 'Test suite execution', true);

console.log('\n🏗️ Production Build:');
const buildSuccess = runCommand('pnpm build', 'Production build');

if (buildSuccess) {
  console.log('\n📊 Build Output Analysis:');
  checkFile('.next/BUILD_ID', 'Build ID generado');
  checkFile('public/sitemap.xml', 'Sitemap generado');
  checkFile('public/robots.txt', 'Robots.txt generado');
}

console.log('\n🚀 GitHub Actions Workflow:');
checkFile('.github/workflows/deploy-workflow.yml', 'Deploy workflow presente');

console.log('\n📋 RESUMEN:');
console.log('==========');

const passed = allChecks.filter(check => check.status).length;
const total = allChecks.length;
const percentage = Math.round((passed / total) * 100);

console.log(`✅ Checks passed: ${passed}/${total} (${percentage}%)`);

if (percentage >= 90) {
  console.log('\n🎉 ¡LISTO PARA DESPLEGAR!');
  console.log('   Tu proyecto está correctamente configurado para Vercel.');
  console.log('\n📝 Próximos pasos:');
  console.log('   1. Configurar variables de entorno en Vercel Dashboard');
  console.log('   2. Conectar repositorio GitHub en Vercel');
  console.log('   3. Hacer deploy inicial');
} else if (percentage >= 75) {
  console.log('\n⚠️  CASI LISTO');
  console.log('   Revisa los checks fallidos antes de desplegar.');
} else {
  console.log('\n❌ REQUIERE ATENCIÓN');
  console.log('   Múltiples problemas detectados. Revisar antes de continuar.');
}

console.log('\n🔗 Enlaces útiles:');
console.log('   • Vercel Dashboard: https://vercel.com/dashboard');
console.log('   • Documentación: https://vercel.com/docs');
console.log('   • VERCEL_CHECKLIST.md para pasos detallados');

process.exit(percentage >= 90 ? 0 : 1);