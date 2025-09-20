export const comments = pgTable(
  'comments',
  {
    id: serial('id').primaryKey(),
    comment: text('comment'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  }
);

export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;

// Drizzle Database type mapping. This aggregates the table definitions so
// other modules can reference the whole schema as a single `Database` type
// when tightening the Drizzle client typing.
export type Database = {
  posts: typeof posts;
  streams: typeof streams;
  services: typeof services;
  projects: typeof projects;
  comments: typeof comments;
};
