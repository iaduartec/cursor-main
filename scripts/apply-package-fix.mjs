mkdir scripts -ea 0
@'
import fs from "fs"

const FILE = "package.json"

function readPkg(path) {
  if (!fs.existsSync(path)) {
    console.error(`[ERROR] No existe ${path} en el directorio actual.`)
    process.exit(1)
  }
  try {
    return JSON.parse(fs.readFileSync(path, "utf8"))
  } catch (e) {
    console.error("[ERROR] No se pudo parsear package.json:", e.message)
    process.exit(1)
  }
}

function writePkg(path, data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2) + "\n", "utf8")
  console.log("package.json actualizado.")
}

const pkg = readPkg(FILE)

// --- scripts ---
pkg.scripts ||= {}

// build:next
if (!pkg.scripts["build:next"]) {
  pkg.scripts["build:next"] = "next build"
}

// build (si tu scripts/build.js YA hace next build, puedes quitar el && ...)
{
  const current = pkg.scripts.build || "next build"
  if (!current.includes("build:next")) {
    pkg.scripts.build = `${current} && pnpm run build:next`
  } else {
    // ya incluye build:next; no tocamos
    pkg.scripts.build = current
  }
}

// check:all
if (!pkg.scripts["check:all"]) {
  pkg.scripts["check:all"] = "pnpm lint && pnpm type-check && pnpm test"
}

// clean (Windows-safe: PowerShell para respetar el patrón con '!')
if (!pkg.scripts.clean) {
  pkg.scripts.clean = "powershell -NoProfile -Command \"git clean -fdX -e \\\"!**/.env*\\\"\""
}

// --- mover @playwright/test a devDependencies si está en dependencies ---
{
  const dep = "@playwright/test"
  const verInDeps = pkg.dependencies?.[dep]
  const verInDev = pkg.devDependencies?.[dep]
  if (verInDeps && !verInDev) {
    pkg.devDependencies ||= {}
    pkg.devDependencies[dep] = verInDeps
    delete pkg.dependencies[dep]
  }
}

// --- engines.node ---
pkg.engines ||= {}
pkg.engines.node = ">=18 <23"

writePkg(FILE, pkg)
'@ | Set-Content -Encoding UTF8 .\scripts\apply-package-fix.mjs
