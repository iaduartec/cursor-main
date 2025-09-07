import {
  boolean,
  index,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

export const posts = pgTable(
  'posts',
  {
    id: serial('id').primaryKey(),
    slug: varchar('slug', { length: 255 }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    content: text('content').notNull(),
    category: varchar('category', { length: 100 }),
    image: varchar('image', { length: 1024 }),
    date: timestamp('date', { withTimezone: false }).notNull(),
    published: boolean('published').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    slugIdx: uniqueIndex('posts_slug_idx').on(table.slug),
    dateIdx: index('posts_date_idx').on(table.date),
  })
);

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

export const streams = pgTable(
  'streams',
  {
    id: serial('id').primaryKey(),
    slug: varchar('slug', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    provider: varchar('provider', { length: 50 }).notNull().default('youtube'),
    youtubeId: varchar('youtube_id', { length: 255 }),
    embedUrl: varchar('embed_url', { length: 1024 }),
    image: varchar('image', { length: 1024 }),
    isLive: boolean('is_live').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    slugIdx: uniqueIndex('streams_slug_idx').on(table.slug),
    providerIdx: index('streams_provider_idx').on(table.provider),
  })
);

export type Stream = typeof streams.$inferSelect;
export type NewStream = typeof streams.$inferInsert;
