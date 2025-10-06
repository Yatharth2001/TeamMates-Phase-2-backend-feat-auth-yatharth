ALTER TABLE `users` MODIFY COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `players` ADD `phone_no` varchar(20);--> statement-breakpoint
ALTER TABLE `players` ADD CONSTRAINT `players_email_unique` UNIQUE(`email`);--> statement-breakpoint
ALTER TABLE `players` DROP COLUMN `phone`;