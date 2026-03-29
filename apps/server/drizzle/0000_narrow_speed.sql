CREATE TABLE `sessions`
(
	`id`                 integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id`            integer NOT NULL,
	`refresh_token_hash` text    NOT NULL,
	`expires_at`         text    NOT NULL,
	`revoked_at`         text,
	`created_at`         text    NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users`
(
	`id`            integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email`         text NOT NULL,
	`password_hash` text NOT NULL,
	`password_salt` text NOT NULL,
	`created_at`    text NOT NULL,
	`updated_at`    text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);
