ALTER TABLE `players` RENAME COLUMN `attendance` TO `attending`;--> statement-breakpoint
ALTER TABLE `players` MODIFY COLUMN `attending` boolean;--> statement-breakpoint
ALTER TABLE `players` MODIFY COLUMN `attending` boolean DEFAULT false;