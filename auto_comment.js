#!/usr/bin/env node
/**
 * Inserta un resumen al inicio de cada archivo como comentario.
 * Ajusta OPENAI_API_KEY y el modelo. Revisa EXT_MAP para añadir más extensiones.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = process.cwd();

// === CONFIG ===
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || ""; // export OPENAI_API_KEY=...
const MODEL = "gpt-4o-mini"; // cambia al que uses
const MAX_BYTES = 150_000; // no resumir archivos enormes (ajusta)
const DRY_RUN = process.env.DRY_RUN === "1"; // si quieres solo ver qué haría

// Mapea extensión -> envoltura de comentario (inicio, fin, línea)
const EXT_MAP = {
  ".ts": { blockStart: "/**", blockEnd: "*/" },
  ".tsx": { blockStart: "/**", blockEnd: "*/" },
  ".js": { blockStart: "/**", blockEnd: "*/" },
  ".jsx": { blockStart: "/**", blockEnd: "*/" },
  ".mjs": { blockStart: "/**", blockEnd: "*/" },
  ".cjs": { blockStart: "/**", blockEnd: "*/" },
  ".json": { blockStart: "/*", blockEnd: "*/" }, // comentario válido aunque JSON no lo soporte formalmente
  ".md": { blockStart: "<!--", blockEnd: "-->" },
  ".py": { blockStart: '"""', blockEnd: '"""' },
  ".rb": { blockStart: "=begin", blockEnd: "=end" },
  ".go": { blockStart: "/*", blockEnd: "*/" },
  ".java": { blockStart: "/**", blockEnd: "*/" },
  ".kt": { blockStart: "/**", blockEnd: "*/" },
  ".php": { blockStart: "/**", blockEnd: "*/" },
  ".css": { blockStart: "/*", blockEnd: "*/" },
  ".scss": { blockStart: "/*", blockEnd: "*/" },
  ".vue": { blockStart: "<!--", blockEnd: "-->" },
  ".svelte": { blockStart: "<!--", blockEnd: "-->" },
  ".sh": { blockStart: ":", blockEnd: "EOF_SH" }, // usaremos heredoc para no romper shebangs
};

const IGNORE_DIRS = new Set([".git", "node_modules", "dist", "build", "out", ".next", ".turbo", ".cache", ".vercel"]);
const SKIP_FILES = new Set(["package-lock.json", "pnpm-lock.yaml", "yarn.lock"]);

function* walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.isDirectory()) {
      if (IGNORE_DIRS.has(e.name)) {continue;}
      yield* walk(path.join(dir, e.name));
    } else if (e.isFile()) {
      yield path.join(dir, e.name);
    }
  }
}

async function summarize(content, relPath) {
  if (!OPENAI_API_KEY) {throw new Error("Falta OPENAI_API_KEY");}

  const prompt = [
    "Resume el archivo en español, 3–6 líneas máximas, estilo técnico claro.",
    "Incluye: propósito, puntos clave, dependencias externas si son evidentes, y efectos/side-effects.",
    "No inventes; si no hay suficiente contexto, di que es limitado.",
    `Ruta: ${relPath}`,
    `Contenido:\n\`\`\`\n${  content.slice(0, 6000)  }\n\`\`\``,
  ].join("\n\n");

  const body = {
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
  };

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`API error ${res.status}: ${t}`);
  }
  const json = await res.json();
  return json.choices?.[0]?.message?.content?.trim() || "";
}

function wrapComment(ext, text) {
  const cfg = EXT_MAP[ext];
  if (!cfg) {return null;}

  if (ext === ".sh") {
    // Evita romper shebang; usaremos bloque a partir de la 2ª línea
    return (original) => {
      const lines = original.split("\n");
      const hasShebang = lines[0]?.startsWith("#!");
      const header = hasShebang ? `${lines.shift()  }\n` : "";
      const block =
        `${cfg.blockStart} <<'${cfg.blockEnd}'\n${ 
        text 
        }\n${cfg.blockEnd}\n`;
      return header + block + lines.join("\n");
    };
  }

  return (original) => {
    return `${cfg.blockStart}\n${text}\n${cfg.blockEnd}\n${  original}`;
  };
}

async function main() {
  const changed = [];
  for (const abs of walk(ROOT)) {
    const rel = path.relative(ROOT, abs);
    const ext = path.extname(abs);
    if (!EXT_MAP[ext]) {continue;}
    if (SKIP_FILES.has(path.basename(abs))) {continue;}

    const stat = fs.statSync(abs);
    if (stat.size > MAX_BYTES) {continue;}

    const source = fs.readFileSync(abs, "utf8");

    // Evitar duplicar si ya tiene un bloque al principio
    const alreadyHasHeader = source.slice(0, 200).includes("Resumen generado");
    if (alreadyHasHeader) {continue;}

    const commentWrapper = wrapComment(ext, `Resumen generado automáticamente.\n\n${rel}\n\n${new Date().toISOString()}\n\n${"—".repeat(30)}\n${  await summarize(source, rel)}`);
    if (!commentWrapper) {continue;}

    const updated = commentWrapper(source);

    if (DRY_RUN) {
      console.log(`[DRY] ${rel}`);
    } else {
      fs.writeFileSync(abs, updated, "utf8");
      changed.push(rel);
      console.log(`[OK] ${rel}`);
    }
  }

  if (!DRY_RUN && changed.length) {
    console.log(`\nArchivos modificados: ${changed.length}`);
  } else if (DRY_RUN) {
    console.log("\nFinalizado en modo DRY_RUN. No se han escrito cambios.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
