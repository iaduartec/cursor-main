/**
Resumen generado automáticamente.

intranet-scaffold/db/schema.ts

2025-09-13T06:20:07.375Z

——————————————————————————————
Archivo .ts: schema.ts
Tamaño: 1386 caracteres, 37 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
import { pgTable, serial, text, varchar, timestamp } from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 200 }).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  hero_image: varchar("hero_image", { length: 1000 }),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 200 }).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const streams = pgTable("streams", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 200 }).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  is_live: varchar("is_live", { length: 10 }).default("false").notNull(),
  started_at: timestamp("started_at"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 200 }).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  body: text("body"),
  published_at: timestamp("published_at"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});
