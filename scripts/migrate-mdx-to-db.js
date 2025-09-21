#!/usr/bin/env node

/**
 * Script para migrar contenido MDX existente a la base de datos Neon
 * Uso: node scripts/migrate-mdx-to-db.js [--dry-run] [--type=posts|services|projects]
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
// Load .env.local first if present, then fall back to .env
const envLocal = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envLocal)) {dotenv.config({ path: envLocal });}
dotenv.config();

import matter from 'gray-matter';
import { db } from '../db/client.js';
import { posts, services, projects } from '../db/schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DRY_RUN = process.argv.includes('--dry-run');
const TYPE_FILTER = process.argv.find(arg => arg.startsWith('--type='))?.split('=')[1];

console.log('🚀 Iniciando migración MDX → Base de datos');
console.log(`📋 Modo: ${DRY_RUN ? 'SIMULACIÓN (dry-run)' : 'EJECUCIÓN REAL'}`);
if (TYPE_FILTER) console.log(`🎯 Tipo filtrado: ${TYPE_FILTER}`);

// Función para leer archivos MDX de un directorio
async function getMdxFiles(dir) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  return entries
    .filter(entry => entry.isFile() && entry.name.toLowerCase().endsWith('.mdx'))
    .map(entry => path.join(dir, entry.name));
}

// Función para parsear frontmatter y contenido
async function parseMdxFile(filePath) {
  const content = await fs.promises.readFile(filePath, 'utf-8');
  const { data, content: bodyContent } = matter(content);

  return {
    frontmatter: data,
    content: bodyContent.trim(),
    filePath
  };
}

// Función para migrar posts
async function migratePosts() {
  console.log('\n📝 Migrando POSTS...');

  const postsDir = path.join(process.cwd(), 'content', 'blog');
  if (!fs.existsSync(postsDir)) {
    console.log('⚠️  Directorio de posts no encontrado:', postsDir);
    return;
  }

  const files = await getMdxFiles(postsDir);
  console.log(`📁 Encontrados ${files.length} archivos de posts`);

  let migrated = 0;
  let skipped = 0;

  for (const file of files) {
    try {
      const { frontmatter, content } = await parseMdxFile(file);

      const slug = frontmatter.slug || path.basename(file, '.mdx');
      const title = frontmatter.title || 'Sin título';
      const description = frontmatter.description || null;
      const category = frontmatter.category || null;
      const image = frontmatter.image || null;
      const date = frontmatter.date ? new Date(frontmatter.date) : new Date();
      const published = frontmatter.published !== false; // Default true

      if (DRY_RUN) {
        console.log(`📋 [DRY] Post: "${title}" (slug: ${slug})`);
      } else {
        // Verificar si ya existe
        const existing = await db
          .select()
          .from(posts)
          .where(eq(posts.slug, slug))
          .limit(1);

        if (existing.length > 0) {
          console.log(`⏭️  Post ya existe: "${title}"`);
          skipped++;
          continue;
        }

        await db.insert(posts).values({
          slug,
          title,
          description,
          content,
          category,
          image,
          date,
          published,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        console.log(`✅ Migrado post: "${title}"`);
        migrated++;
      }
    } catch (error) {
      console.error(`❌ Error migrando post ${file}:`, error.message);
    }
  }

  console.log(`📊 Posts: ${migrated} migrados, ${skipped} omitidos`);
}

// Función para migrar servicios
async function migrateServices() {
  console.log('\n🔧 Migrando SERVICIOS...');

  const servicesDir = path.join(process.cwd(), 'content', 'servicios');
  if (!fs.existsSync(servicesDir)) {
    console.log('⚠️  Directorio de servicios no encontrado:', servicesDir);
    return;
  }

  const files = await getMdxFiles(servicesDir);
  console.log(`📁 Encontrados ${files.length} archivos de servicios`);

  let migrated = 0;
  let skipped = 0;

  for (const file of files) {
    try {
      const { frontmatter, content } = await parseMdxFile(file);

      const slug = frontmatter.slug || path.basename(file, '.mdx');
      const title = frontmatter.title || 'Sin título';
      const description = frontmatter.description || null;
      const image = frontmatter.image || null;
      const areaServed = frontmatter.areaServed || null;
      const hasOfferCatalog = frontmatter.hasOfferCatalog || false;

      if (DRY_RUN) {
        console.log(`📋 [DRY] Servicio: "${title}" (slug: ${slug})`);
      } else {
        // Verificar si ya existe
        const existing = await db
          .select()
          .from(services)
          .where(eq(services.slug, slug))
          .limit(1);

        if (existing.length > 0) {
          console.log(`⏭️  Servicio ya existe: "${title}"`);
          skipped++;
          continue;
        }

        await db.insert(services).values({
          slug,
          title,
          description,
          image,
          areaServed,
          hasOfferCatalog,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        console.log(`✅ Migrado servicio: "${title}"`);
        migrated++;
      }
    } catch (error) {
      console.error(`❌ Error migrando servicio ${file}:`, error.message);
    }
  }

  console.log(`📊 Servicios: ${migrated} migrados, ${skipped} omitidos`);
}

// Función para migrar proyectos
async function migrateProjects() {
  console.log('\n🏗️  Migrando PROYECTOS...');

  const projectsDir = path.join(process.cwd(), 'content', 'proyectos');
  if (!fs.existsSync(projectsDir)) {
    console.log('⚠️  Directorio de proyectos no encontrado:', projectsDir);
    return;
  }

  const files = await getMdxFiles(projectsDir);
  console.log(`📁 Encontrados ${files.length} archivos de proyectos`);

  let migrated = 0;
  let skipped = 0;

  for (const file of files) {
    try {
      const { frontmatter, content } = await parseMdxFile(file);

      const slug = frontmatter.slug || path.basename(file, '.mdx');
      const title = frontmatter.title || 'Sin título';
      const description = frontmatter.description || null;
      const category = frontmatter.category || null;
      const image = frontmatter.image || null;
      const date = frontmatter.date ? new Date(frontmatter.date) : new Date();

      if (DRY_RUN) {
        console.log(`📋 [DRY] Proyecto: "${title}" (slug: ${slug})`);
      } else {
        // Verificar si ya existe
        const existing = await db
          .select()
          .from(projects)
          .where(eq(projects.slug, slug))
          .limit(1);

        if (existing.length > 0) {
          console.log(`⏭️  Proyecto ya existe: "${title}"`);
          skipped++;
          continue;
        }

        await db.insert(projects).values({
          slug,
          title,
          description,
          content,
          category,
          image,
          date,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        console.log(`✅ Migrado proyecto: "${title}"`);
        migrated++;
      }
    } catch (error) {
      console.error(`❌ Error migrando proyecto ${file}:`, error.message);
    }
  }

  console.log(`📊 Proyectos: ${migrated} migrados, ${skipped} omitidos`);
}

// Función principal
async function main() {
  try {
    // Verificar conexión a DB
    if (!process.env.POSTGRES_URL && !process.env.DATABASE_URL) {
      console.error('❌ No se encontró configuración de base de datos');
      console.error('💡 Asegúrate de tener POSTGRES_URL o DATABASE_URL en tu .env');
      process.exit(1);
    }

    console.log('🔍 Verificando conexión a base de datos...');
    await db.execute('SELECT 1');
    console.log('✅ Conexión a base de datos OK');

    // Ejecutar migraciones según filtro
    if (!TYPE_FILTER || TYPE_FILTER === 'posts') {
      await migratePosts();
    }

    if (!TYPE_FILTER || TYPE_FILTER === 'services') {
      await migrateServices();
    }

    if (!TYPE_FILTER || TYPE_FILTER === 'projects') {
      await migrateProjects();
    }

    console.log('\n🎉 Migración completada exitosamente!');
    if (DRY_RUN) {
      console.log('💡 Ejecuta sin --dry-run para aplicar los cambios');
    }

  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    process.exit(1);
  }
}

main();