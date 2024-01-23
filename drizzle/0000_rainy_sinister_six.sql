CREATE TABLE `option` (
	`optionId` varchar(32) NOT NULL,
	`questionId` varchar(32) NOT NULL,
	`optionText` varchar(255) NOT NULL,
	`isCorrectOption` boolean NOT NULL DEFAULT false,
	CONSTRAINT `option_optionId` PRIMARY KEY(`optionId`)
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
CREATE TABLE `question` (
	`questionId` varchar(32) NOT NULL,
	`quizId` varchar(32) NOT NULL,
	`questionText` text NOT NULL,
	`mark` int NOT NULL,
	CONSTRAINT `question_questionId` PRIMARY KEY(`questionId`)
);
--> statement-breakpoint
CREATE TABLE `quiz` (
	`quizId` varchar(32) NOT NULL,
	`quizTitle` varchar(32) NOT NULL,
	`totalMarks` int NOT NULL,
	CONSTRAINT `quiz_quizId` PRIMARY KEY(`quizId`)
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
	`userQuizId` varchar(32) NOT NULL,
	`userId` varchar(32) NOT NULL,
	`quizId` varchar(32) NOT NULL,
	`score` int NOT NULL DEFAULT 0,
	`status` enum('NOT_STARTED','IN_PROGRESS','COMPLETED') NOT NULL DEFAULT 'NOT_STARTED',
	CONSTRAINT `userQuizzes_userQuizId` PRIMARY KEY(`userQuizId`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(32) NOT NULL,
	`name` varchar(32) NOT NULL,
	`email` varchar(64) NOT NULL,
	`password` varchar(64) NOT NULL,
	`emailVerified` timestamp(3),
	`role` enum('ADMIN','USER') NOT NULL DEFAULT 'USER',
	`isTwoFactorEnabled` boolean NOT NULL DEFAULT false,
	`image` varchar(255),
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_name_unique` UNIQUE(`name`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`)
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
ALTER TABLE `option` ADD CONSTRAINT `option_questionId_question_questionId_fk` FOREIGN KEY (`questionId`) REFERENCES `question`(`questionId`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `question` ADD CONSTRAINT `question_quizId_quiz_quizId_fk` FOREIGN KEY (`quizId`) REFERENCES `quiz`(`quizId`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `twoFactorConfimation` ADD CONSTRAINT `twoFactorConfimation_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userQuizzes` ADD CONSTRAINT `userQuizzes_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userQuizzes` ADD CONSTRAINT `userQuizzes_quizId_quiz_quizId_fk` FOREIGN KEY (`quizId`) REFERENCES `quiz`(`quizId`) ON DELETE cascade ON UPDATE no action;