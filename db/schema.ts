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

