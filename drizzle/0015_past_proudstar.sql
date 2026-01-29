CREATE TABLE `custom_formations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`sport_id` varchar(50) NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`positions` json NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `custom_formations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `formations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sport_id` varchar(50) NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`positions` json NOT NULL,
	`is_default` int NOT NULL DEFAULT 1,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `formations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `game_plans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`opponent` varchar(255),
	`game_date` timestamp,
	`sport_id` varchar(50) NOT NULL,
	`formation_id` int,
	`key_tactics` json,
	`set_plays` json,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `game_plans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `set_plays` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sport_id` varchar(50) NOT NULL,
	`name` varchar(255) NOT NULL,
	`is_template` int NOT NULL DEFAULT 1,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `set_plays_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tactics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sport_id` varchar(50) NOT NULL,
	`name` varchar(255) NOT NULL,
	`is_template` int NOT NULL DEFAULT 1,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `tactics_id` PRIMARY KEY(`id`)
);
