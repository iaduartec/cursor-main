import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const NEXT_DIR = path.resolve('.next');
const NEXT_SITEMAP_BIN = path.resolve(
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'next-sitemap.CMD' : 'next-sitemap',
);
const require = createRequire(import.meta.url);
const packageJson = (() => {
  try {
    return require('../package.json');
  } catch {
    return undefined;
  }
})();
const nextSitemapVersion =
  packageJson?.dependencies?.['next-sitemap'] ??
  packageJson?.devDependencies?.['next-sitemap'];

function runNextSitemap() {
  const pnpmResult = spawnSync('pnpm', ['exec', 'next-sitemap'], {
    stdio: 'inherit',
  });

  if (pnpmResult.status === 0) {
    return;
  }

  if (pnpmResult.error && pnpmResult.error.code !== 'ENOENT') {
    const code = pnpmResult.status ?? 1;
    console.error(`[postbuild] next-sitemap via pnpm failed with exit code ${code}.`);
    process.exit(code);
  }

  const dlxArgs = ['dlx', nextSitemapVersion ? `next-sitemap@${nextSitemapVersion}` : 'next-sitemap'];
  const pnpmDlxResult = spawnSync('pnpm', dlxArgs, { stdio: 'inherit' });

  if (pnpmDlxResult.status === 0) {
    return;
  }

  if (pnpmDlxResult.error && pnpmDlxResult.error.code !== 'ENOENT') {
    const code = pnpmDlxResult.status ?? 1;
    console.error(`[postbuild] next-sitemap via pnpm dlx failed with exit code ${code}.`);
    process.exit(code);
  }

  // Intentar resolver el ejecutable vía require.resolve como fallback robusto
  const candidates = [
    // CLI tradicional
    'next-sitemap/bin/cli.js',
    // Distribuciones modernas
    'next-sitemap/dist/cli.js',
    'next-sitemap/dist/cli.mjs',
    // Como último recurso, index (puede no ejecutar CLI)
    'next-sitemap/dist/index.js',
  ];
  for (const mod of candidates) {
    try {
      const resolved = require.resolve(mod);
      const nodeRun = spawnSync(process.execPath, [resolved], { stdio: 'inherit' });
      if (nodeRun.status === 0) {return;}
    } catch {
      // probar siguiente candidato
    }
  }

  if (!existsSync(NEXT_SITEMAP_BIN)) {
    console.warn('[postbuild] next-sitemap binary not found via pnpm/resolve. Skipping sitemap generation.');
    return;
  }

  const directResult = spawnSync(NEXT_SITEMAP_BIN, { stdio: 'inherit' });

  if (directResult.status !== 0) {
    const code = directResult.status ?? 1;
    console.error(`[postbuild] next-sitemap binary failed with exit code ${code}.`);
    process.exit(code);
  }
}

function collectFallbackDirs() {
  const candidates = new Set(
    [
      process.env.VERCEL_OUTPUT_DIR,
      process.env.BUILD_OUTPUT_DIRECTORY,
      process.env.BUILD_OUTPUT_DIR,
      process.env.NEXT_OUTPUT_DIR,
      process.env.NEXT_DIST_DIR,
      process.env.OUTPUT_DIR,
    ]
      .filter((value) => typeof value === 'string')
      .map((value) => value.trim())
      .filter((value) => value.length > 0 && value !== '.next'),
  );

  return Array.from(candidates);
}

function mirrorManifests(targetDir) {
  if (!existsSync(targetDir)) {
    return; // No intentar crear/copiar si el destino base no existe
  }
  const manifestFiles = [
    'routes-manifest.json',
    'build-manifest.json',
    'prerender-manifest.json',
    'export-marker.json',
  ];

  let copiedAny = false;

  for (const fileName of manifestFiles) {
    const sourceFile = path.join(NEXT_DIR, fileName);

    if (!existsSync(sourceFile)) {
      continue;
    }

    const destinationFile = path.resolve(targetDir, fileName);
    mkdirSync(path.dirname(destinationFile), { recursive: true });
    copyFileSync(sourceFile, destinationFile);
    copiedAny = true;
  }

  if (copiedAny) {
    console.log(`[postbuild] Mirrored Next.js manifest files to "${targetDir}".`);
  }
}

runNextSitemap();

if (!existsSync(NEXT_DIR)) {
  console.warn('[postbuild] .next directory not found. Skipping manifest mirroring.');
  process.exit(0);
}

for (const dir of collectFallbackDirs()) {
  mirrorManifests(dir);
}
