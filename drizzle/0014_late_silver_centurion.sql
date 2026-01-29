CREATE TABLE `player_development` (
	`id` int AUTO_INCREMENT NOT NULL,
	`player_id` int NOT NULL,
	`overall_rating` int NOT NULL DEFAULT 0,
	`last_evaluation` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`status` varchar(50) NOT NULL DEFAULT 'stable',
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `player_development_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `player_goals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`player_development_id` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`target_date` timestamp NOT NULL,
	`progress` int NOT NULL DEFAULT 0,
	`category` varchar(50) NOT NULL,
	`status` varchar(50) NOT NULL DEFAULT 'active',
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `player_goals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `player_skill_ratings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`player_development_id` int NOT NULL,
	`technical` int NOT NULL DEFAULT 0,
	`physical` int NOT NULL DEFAULT 0,
	`mental` int NOT NULL DEFAULT 0,
	`tactical` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `player_skill_ratings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `player_development` ADD CONSTRAINT `player_development_player_id_players_id_fk` FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `player_goals` ADD CONSTRAINT `player_goals_player_development_id_player_development_id_fk` FOREIGN KEY (`player_development_id`) REFERENCES `player_development`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `player_skill_ratings` ADD CONSTRAINT `player_skill_ratings_player_development_id_player_development_id_fk` FOREIGN KEY (`player_development_id`) REFERENCES `player_development`(`id`) ON DELETE cascade ON UPDATE no action;