CREATE TABLE `player_stats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`game_id` int NOT NULL,
	`player_id` varchar(64) NOT NULL,
	`player_name` varchar(255) NOT NULL,
	`minutes_played` int DEFAULT 0,
	`goals` int DEFAULT 0,
	`assists` int DEFAULT 0,
	`shots` int DEFAULT 0,
	`tackles` int DEFAULT 0,
	`interceptions` int DEFAULT 0,
	`fouls_committed` int DEFAULT 0,
	`fouls_received` int DEFAULT 0,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `player_stats_id` PRIMARY KEY(`id`),
	CONSTRAINT `uniq_playerstats_game_player` UNIQUE(`game_id`,`player_id`)
);
--> statement-breakpoint
CREATE TABLE `team_stats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`game_id` int NOT NULL,
	`home_score` int NOT NULL DEFAULT 0,
	`away_score` int NOT NULL DEFAULT 0,
	`outcome` enum('win','loss','tie'),
	`shots` int,
	`shots_on_goal` int,
	`corner_kicks` int,
	`fouls` int,
	`saves` int,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `team_stats_id` PRIMARY KEY(`id`),
	CONSTRAINT `uniq_teamstats_game` UNIQUE(`game_id`)
);
--> statement-breakpoint
ALTER TABLE `player_stats` ADD CONSTRAINT `player_stats_game_id_events_id_fk` FOREIGN KEY (`game_id`) REFERENCES `events`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `team_stats` ADD CONSTRAINT `team_stats_game_id_events_id_fk` FOREIGN KEY (`game_id`) REFERENCES `events`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_playerstats_game` ON `player_stats` (`game_id`);