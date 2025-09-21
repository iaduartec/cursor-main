import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const NEXT_DIR = path.resolve('.next');
const NEXT_SITEMAP_BIN = path.resolve(
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'next-sitemap.cmd' : 'next-sitemap',
);

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

  if (!existsSync(NEXT_SITEMAP_BIN)) {
    console.warn('[postbuild] next-sitemap binary not found. Skipping sitemap generation.');
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
