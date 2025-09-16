#!/usr/bin/env tsx
/**
Resumen generado automáticamente.

intranet-scaffold/scripts/db/seed-projects.ts

2025-09-13T06:20:07.377Z

——————————————————————————————
Archivo .ts: seed-projects.ts
Tamaño: 1947 caracteres, 61 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/

import "dotenv/config";
import postgres from "postgres";
import fs from "fs";
import path from "path";

async function main() {
  const databaseUrl =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.SUPABASE_DB_URL ||
    process.env.cxz_POSTGRES_URL ||
    process.env.cxz_POSTGRES_URL_NON_POOLING;
  if (!databaseUrl) {
    console.warn("No database URL found in env. Aborting seed.");
    process.exit(1);
  }

  const sql = postgres(databaseUrl, { ssl: 'require' });

  const contentDir = path.resolve(process.cwd(), "content/proyectos");
  if (!fs.existsSync(contentDir)) {
    console.warn("content/proyectos not found. Nothing to seed.");
    await sql.end({ timeout: 5 });
    process.exit(0);
  }

  const files = fs.readdirSync(contentDir).filter(f => f.endsWith(".mdx") || f.endsWith(".md"));
  console.log(`Found ${files.length} project files to seed`);

  for (const file of files) {
    const filePath = path.join(contentDir, file);
    const raw = fs.readFileSync(filePath, "utf8");
    const match = raw.match(/slug:\s*(.+)/);
    const slug = match ? match[1].trim().replace(/['"\n]/g, "") : file.replace(/\.mdx?$/, "");
    const titleMatch = raw.match(/title:\s*(.+)/);
    const title = titleMatch ? titleMatch[1].trim().replace(/['"\n]/g, "") : slug;

    const descMatch = raw.match(/description:\s*([^\n]+)/);
    const description = descMatch ? descMatch[1].trim().replace(/['"\n]/g, "") : null;

    // Upsert using postgres library
    await sql`
      INSERT INTO projects (slug, title, description)
      VALUES (${slug}, ${title}, ${description})
      ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description
    `;

    console.log(`Upserted project: ${slug}`);
  }

  await sql.end({ timeout: 5 });
  console.log("✅ Projects seeding completed successfully");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
