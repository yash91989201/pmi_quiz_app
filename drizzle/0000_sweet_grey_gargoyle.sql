CREATE TABLE `options` (
	`optionId` varchar(32) NOT NULL,
	`questionId` varchar(32) NOT NULL,
	`optionText` varchar(255),
	`isCorrectOption` boolean DEFAULT false,
	CONSTRAINT `options_optionId` PRIMARY KEY(`optionId`)
);
--> statement-breakpoint
CREATE TABLE `passwordResetToken` (
	`id` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `passwordResetToken_id_token_pk` PRIMARY KEY(`id`,`token`),
	CONSTRAINT `passwordResetToken_email_unique` UNIQUE(`email`),
	CONSTRAINT `passwordResetToken_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `questions` (
	`questionId` varchar(32) NOT NULL,
	`quizId` varchar(32) NOT NULL,
	`questionText` text,
	`mark` int,
	CONSTRAINT `questions_questionId` PRIMARY KEY(`questionId`)
);
--> statement-breakpoint
CREATE TABLE `quizzes` (
	`quizId` varchar(32) NOT NULL,
	`quizTitle` varchar(32),
	`totalMarks` int,
	CONSTRAINT `quizzes_quizId` PRIMARY KEY(`quizId`)
);
--> statement-breakpoint
CREATE TABLE `twoFactorConfimation` (
	`id` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	CONSTRAINT `twoFactorConfimation_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `twoFactorToken` (
	`id` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `twoFactorToken_id_token_pk` PRIMARY KEY(`id`,`token`),
	CONSTRAINT `twoFactorToken_email_unique` UNIQUE(`email`),
	CONSTRAINT `twoFactorToken_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `userQuizzes` (
	`userId` varchar(32) NOT NULL,
	`quizId` varchar(32) NOT NULL,
	`score` int,
	`status` enum('NOT_STARTED','IN_PROGRESS','COMPLETED') DEFAULT 'NOT_STARTED',
	CONSTRAINT `id` PRIMARY KEY(`quizId`,`userId`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`userId` varchar(32) NOT NULL,
	`userName` varchar(32) NOT NULL,
	`email` varchar(64) NOT NULL,
	`password` varchar(64) NOT NULL,
	`emailVerified` timestamp(3),
	`role` enum('ADMIN','USER') NOT NULL DEFAULT 'USER',
	`isTwoFactorEnabled` boolean NOT NULL DEFAULT false,
	`image` varchar(255),
	CONSTRAINT `users_userId` PRIMARY KEY(`userId`),
	CONSTRAINT `users_userName_unique` UNIQUE(`userName`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `verificationToken` (
	`id` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `verificationToken_id_token_pk` PRIMARY KEY(`id`,`token`),
	CONSTRAINT `verificationToken_email_unique` UNIQUE(`email`),
	CONSTRAINT `verificationToken_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE INDEX `questionId_Idx` ON `options` (`questionId`);--> statement-breakpoint
CREATE INDEX `quizId_Idx` ON `userQuizzes` (`quizId`);--> statement-breakpoint
CREATE INDEX `userId_Idx` ON `userQuizzes` (`userId`);--> statement-breakpoint
ALTER TABLE `options` ADD CONSTRAINT `options_questionId_questions_questionId_fk` FOREIGN KEY (`questionId`) REFERENCES `questions`(`questionId`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `questions` ADD CONSTRAINT `questions_quizId_quizzes_quizId_fk` FOREIGN KEY (`quizId`) REFERENCES `quizzes`(`quizId`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `twoFactorConfimation` ADD CONSTRAINT `twoFactorConfimation_userId_users_userId_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userQuizzes` ADD CONSTRAINT `userQuizzes_userId_users_userId_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userQuizzes` ADD CONSTRAINT `userQuizzes_quizId_quizzes_quizId_fk` FOREIGN KEY (`quizId`) REFERENCES `quizzes`(`quizId`) ON DELETE cascade ON UPDATE no action;