<<<<<<< HEAD
=======
/**
Resumen generado automáticamente.

scripts/prebuild.mjs

2025-09-13T06:20:07.386Z

——————————————————————————————
Archivo .mjs: prebuild.mjs
Tamaño: 662 caracteres, 20 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
// scripts/prebuild.mjs
import { existsSync } from "fs";
import { spawnSync } from "child_process";

function runIfExists(file, args = []) {
  if (!existsSync(file)) {
    console.log(`[prebuild] ${file} no encontrado. Saltando.`);
    return;
  }
  const res = spawnSync(process.execPath, [file, ...args], { stdio: "inherit" });
  if (res.status !== 0) {
    console.error(`[prebuild] Falló ${file} con código ${res.status}`);
    process.exit(res.status ?? 1);
  }
}

runIfExists("scripts/fix_text_encoding.js");
<<<<<<< HEAD
runIfExists("scripts/clean_contentlayer.js");
runIfExists("scripts/generate_missing_images_runner.js", ["--only-missing", "--min-bytes", "1000"]);
=======
// Use the CommonJS variant to avoid ESM parsing errors when node treats .js as ESM
runIfExists("scripts/clean_contentlayer.cjs");
// Force Node fallback to avoid running local Python that may have incompatible headers
runIfExists("scripts/generate_missing_images_runner.cjs", ["--only-missing", "--min-bytes", "1000", "--skip-python"]);
// Validate MDX frontmatter early to fail fast on Vercel builds
runIfExists("scripts/validate-mdx-frontmatter.cjs");
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
