const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

describe('Repository Context Validation', () => {
  it('should have valid package.json with expected scripts', () => {
    const packagePath = path.join(__dirname, '..', 'package.json');
    assert(fs.existsSync(packagePath), 'package.json should exist');
    
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
    
    assert(packageJson.scripts, 'package.json should have scripts');
    assert(packageJson.scripts.build, 'package.json should have build script');
    assert(packageJson.scripts.lint, 'package.json should have lint script');
    assert(packageJson.scripts.test, 'package.json should have test script');
  });

  it('should have main code directories', () => {
    const rootDir = path.join(__dirname, '..');
    const dirs = ['app', 'components', 'lib', 'db', 'content'];
    
    dirs.forEach(dir => {
      const dirPath = path.join(rootDir, dir);
      assert(fs.existsSync(dirPath), `Directory ${dir} should exist`);
    });
  });

  it('should have TypeScript and Next.js configuration', () => {
    const rootDir = path.join(__dirname, '..');
    const configFiles = ['tsconfig.json', 'next.config.mjs'];
    
    configFiles.forEach(file => {
      const filePath = path.join(rootDir, file);
      assert(fs.existsSync(filePath), `Configuration file ${file} should exist`);
    });
  });

  it('should have context repository file with correct information', () => {
    const contextPath = path.join(__dirname, '..', 'CONTEXTO_REPO.md');
    assert(fs.existsSync(contextPath), 'CONTEXTO_REPO.md should exist');
    
    const content = fs.readFileSync(contextPath, 'utf-8');
    
    // Verificar que contiene la información esperada
    assert(content.includes('Next.js 14'), 'Should mention Next.js 14');
    assert(content.includes('TypeScript'), 'Should mention TypeScript');
    assert(content.includes('Tailwind CSS'), 'Should mention Tailwind CSS');
    assert(content.includes('Drizzle ORM'), 'Should mention Drizzle ORM');
    assert(content.includes('pnpm lint'), 'Should mention pnpm lint');
    assert(content.includes('pnpm build'), 'Should mention pnpm build');
    assert(content.includes('pnpm test'), 'Should mention pnpm test');
    assert(content.includes('app/'), 'Should mention app/ directory');
    assert(content.includes('components/'), 'Should mention components/ directory');
  });
});