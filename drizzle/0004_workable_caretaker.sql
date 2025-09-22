ALTER TABLE "posts" ADD COLUMN "user_id" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "user_id" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "user_id" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "streams" ADD COLUMN "user_id" varchar(255) NOT NULL;--> statement-breakpoint
CREATE INDEX "posts_user_idx" ON "posts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "projects_user_idx" ON "projects" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "services_user_idx" ON "services" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "streams_user_idx" ON "streams" USING btree ("user_id");