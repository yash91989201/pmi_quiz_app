CREATE TABLE `options` (
	`optionId` varchar(32) NOT NULL,
	`questionId` varchar(32) NOT NULL,
	`optionOrder` smallint NOT NULL,
	`optionText` varchar(255) NOT NULL,
	`isCorrectOption` boolean NOT NULL DEFAULT false,
	CONSTRAINT `options_optionId` PRIMARY KEY(`optionId`)
);

CREATE TABLE `orders` (
	`orderId` varchar(32) NOT NULL,
	`orderText` varchar(255) NOT NULL,
	`orderPriority` smallint NOT NULL DEFAULT 0,
	CONSTRAINT `orders_orderId` PRIMARY KEY(`orderId`)
);

CREATE TABLE `passwordResetTokens` (
	`id` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `passwordResetTokens_id_token_pk` PRIMARY KEY(`id`,`token`),
	CONSTRAINT `passwordResetTokens_email_unique` UNIQUE(`email`),
	CONSTRAINT `passwordResetTokens_token_unique` UNIQUE(`token`)
);

CREATE TABLE `questions` (
	`questionId` varchar(32) NOT NULL,
	`quizId` varchar(32) NOT NULL,
	`questionText` text NOT NULL,
	`mark` smallint NOT NULL,
	`questionOrder` smallint NOT NULL,
	`questionImageId` varchar(64),
	CONSTRAINT `questions_questionId` PRIMARY KEY(`questionId`)
);

CREATE TABLE `quizzes` (
	`quizId` varchar(32) NOT NULL,
	`quizTitle` varchar(32) NOT NULL,
	`totalMark` smallint NOT NULL,
	CONSTRAINT `quizzes_quizId` PRIMARY KEY(`quizId`)
);

CREATE TABLE `twoFactorConfimation` (
	`id` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	CONSTRAINT `twoFactorConfimation_userId_unique` UNIQUE(`userId`)
);

CREATE TABLE `twoFactorTokens` (
	`id` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `twoFactorTokens_id_token_pk` PRIMARY KEY(`id`,`token`),
	CONSTRAINT `twoFactorTokens_email_unique` UNIQUE(`email`),
	CONSTRAINT `twoFactorTokens_token_unique` UNIQUE(`token`)
);

CREATE TABLE `userOrders` (
	`userOrderId` varchar(32) NOT NULL,
	`userId` varchar(32) NOT NULL,
	`orderId` varchar(32) NOT NULL,
	`orderText` varchar(255) NOT NULL,
	`orderPriority` smallint NOT NULL DEFAULT 0,
	`isCompleted` boolean NOT NULL DEFAULT false,
	CONSTRAINT `userOrders_userOrderId` PRIMARY KEY(`userOrderId`)
);

CREATE TABLE `userQuizzes` (
	`userQuizId` varchar(32) NOT NULL,
	`userId` varchar(32) NOT NULL,
	`quizId` varchar(32) NOT NULL,
	`quizTitle` varchar(32) NOT NULL,
	`totalMark` smallint NOT NULL,
	`score` smallint NOT NULL DEFAULT 0,
	`status` enum('NOT_STARTED','IN_PROGRESS','COMPLETED') NOT NULL DEFAULT 'NOT_STARTED',
	`certificateId` varchar(64),
	CONSTRAINT `userQuizzes_userQuizId` PRIMARY KEY(`userQuizId`)
);

CREATE TABLE `users` (
	`id` varchar(32) NOT NULL,
	`name` varchar(32) NOT NULL,
	`email` varchar(64) NOT NULL,
	`password` varchar(64) NOT NULL,
	`emailVerified` timestamp(3),
	`role` enum('ADMIN','USER') NOT NULL DEFAULT 'USER',
	`isTwoFactorEnabled` boolean NOT NULL DEFAULT false,
	`image` varchar(255),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_name_unique` UNIQUE(`name`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);

CREATE TABLE `verificationTokens` (
	`id` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `verificationTokens_id_token_pk` PRIMARY KEY(`id`,`token`),
	CONSTRAINT `verificationTokens_email_unique` UNIQUE(`email`),
	CONSTRAINT `verificationTokens_token_unique` UNIQUE(`token`)
);

ALTER TABLE `options` ADD CONSTRAINT `options_questionId_questions_questionId_fk` FOREIGN KEY (`questionId`) REFERENCES `questions`(`questionId`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `questions` ADD CONSTRAINT `questions_quizId_quizzes_quizId_fk` FOREIGN KEY (`quizId`) REFERENCES `quizzes`(`quizId`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `twoFactorConfimation` ADD CONSTRAINT `twoFactorConfimation_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `userOrders` ADD CONSTRAINT `userOrders_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `userOrders` ADD CONSTRAINT `userOrders_orderId_orders_orderId_fk` FOREIGN KEY (`orderId`) REFERENCES `orders`(`orderId`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `userQuizzes` ADD CONSTRAINT `userQuizzes_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `userQuizzes` ADD CONSTRAINT `userQuizzes_quizId_quizzes_quizId_fk` FOREIGN KEY (`quizId`) REFERENCES `quizzes`(`quizId`) ON DELETE cascade ON UPDATE no action;