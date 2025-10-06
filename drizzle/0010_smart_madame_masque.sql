CREATE TABLE `events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` varchar(50) NOT NULL,
	`title` varchar(255) NOT NULL,
	`date` date NOT NULL,
	`start_time` time,
	`end_time` time,
	`opponent` varchar(255),
	`game_type` varchar(50),
	`arrival_time` time,
	`uniform` varchar(100),
	`dress_code` varchar(255),
	`focus_areas` varchar(255),
	`location` varchar(255),
	`address` varchar(255),
	`description` text,
	`notify_team` boolean DEFAULT true,
	CONSTRAINT `events_id` PRIMARY KEY(`id`)
);
