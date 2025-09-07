CREATE TABLE "streams" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"provider" varchar(50) DEFAULT 'youtube' NOT NULL,
	"youtube_id" varchar(255),
	"embed_url" varchar(1024),
	"image" varchar(1024),
	"is_live" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "streams_slug_idx" ON "streams" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "streams_provider_idx" ON "streams" USING btree ("provider");