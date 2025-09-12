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
runIfExists("scripts/clean_contentlayer.js");
runIfExists("scripts/generate_missing_images_runner.js", ["--only-missing", "--min-bytes", "1000"]);
