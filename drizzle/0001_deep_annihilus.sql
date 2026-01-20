CREATE TABLE `favorites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`movieId` int NOT NULL,
	`movieTitle` text NOT NULL,
	`posterPath` varchar(255),
	`rating` int NOT NULL,
	`overview` text,
	`addedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `favorites_id` PRIMARY KEY(`id`)
);
