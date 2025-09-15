CREATE TABLE "comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"comment" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
