CREATE TABLE `email_recipients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email_id` int NOT NULL,
	`recipient_type` varchar(50) NOT NULL,
	`recipient_id` int,
	`recipient_name` varchar(255) NOT NULL,
	`recipient_email` varchar(255) NOT NULL,
	`is_read` boolean NOT NULL DEFAULT false,
	`read_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `email_recipients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `emails` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sender_id` varchar(36) NOT NULL,
	`sender_name` varchar(255) NOT NULL,
	`sender_email` varchar(255) NOT NULL,
	`subject` varchar(500) NOT NULL,
	`content` text NOT NULL,
	`html_content` text,
	`attachments` text,
	`status` varchar(50) NOT NULL DEFAULT 'sent',
	`sent_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `emails_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `email_recipients` ADD CONSTRAINT `email_recipients_email_id_emails_id_fk` FOREIGN KEY (`email_id`) REFERENCES `emails`(`id`) ON DELETE cascade ON UPDATE no action;