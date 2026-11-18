/*
  Warnings:

  - You are about to drop the column `manager_id` on the `team` table. All the data in the column will be lost.
  - Added the required column `confederation` to the `competition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `confederation` to the `team` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `match` DROP FOREIGN KEY `match_away_team_id_fkey`;

-- DropForeignKey
ALTER TABLE `match` DROP FOREIGN KEY `match_home_team_id_fkey`;

-- DropForeignKey
ALTER TABLE `team` DROP FOREIGN KEY `team_manager_id_fkey`;

-- DropIndex
DROP INDEX `match_away_team_id_fkey` ON `match`;

-- DropIndex
DROP INDEX `match_home_team_id_fkey` ON `match`;

-- DropIndex
DROP INDEX `team_manager_id_fkey` ON `team`;

-- AlterTable
ALTER TABLE `competition` ADD COLUMN `confederation` ENUM('UEFA', 'CONMEBOL', 'CONCACAF', 'AFC', 'CAF', 'OFC') NOT NULL;

-- AlterTable
ALTER TABLE `match` ADD COLUMN `away_national_team_id` INTEGER NULL,
    ADD COLUMN `home_national_team_id` INTEGER NULL,
    ADD COLUMN `winner_national_team_id` INTEGER NULL,
    MODIFY `home_team_id` INTEGER NULL,
    MODIFY `away_team_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `team` DROP COLUMN `manager_id`,
    ADD COLUMN `confederation` ENUM('UEFA', 'CONMEBOL', 'CONCACAF', 'AFC', 'CAF', 'OFC') NOT NULL,
    ADD COLUMN `managerId` INTEGER NULL;

-- CreateTable
CREATE TABLE `national_team` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `short_name` VARCHAR(191) NOT NULL,
    `logo` VARCHAR(191) NULL,
    `foundation_date` DATE NOT NULL,
    `primary_color` VARCHAR(191) NOT NULL,
    `secondary_color` VARCHAR(191) NOT NULL,
    `stadium_id` INTEGER NOT NULL,
    `manager_id` INTEGER NOT NULL,
    `confederation` ENUM('UEFA', 'CONMEBOL', 'CONCACAF', 'AFC', 'CAF', 'OFC') NOT NULL,

    UNIQUE INDEX `national_team_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `player_national_team` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `player_id` INTEGER NOT NULL,
    `national_team_id` INTEGER NOT NULL,
    `jersey_number` INTEGER NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NULL,

    UNIQUE INDEX `player_national_team_player_id_national_team_id_start_date_key`(`player_id`, `national_team_id`, `start_date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `manager_team` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `manager_id` INTEGER NOT NULL,
    `team_id` INTEGER NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NULL,

    UNIQUE INDEX `manager_team_manager_id_team_id_start_date_key`(`manager_id`, `team_id`, `start_date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `manager_national_team` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `manager_id` INTEGER NOT NULL,
    `national_team_id` INTEGER NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NULL,

    UNIQUE INDEX `manager_national_team_manager_id_national_team_id_start_date_key`(`manager_id`, `national_team_id`, `start_date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `match` ADD CONSTRAINT `match_home_team_id_fkey` FOREIGN KEY (`home_team_id`) REFERENCES `team`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match` ADD CONSTRAINT `match_away_team_id_fkey` FOREIGN KEY (`away_team_id`) REFERENCES `team`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match` ADD CONSTRAINT `match_home_national_team_id_fkey` FOREIGN KEY (`home_national_team_id`) REFERENCES `national_team`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match` ADD CONSTRAINT `match_away_national_team_id_fkey` FOREIGN KEY (`away_national_team_id`) REFERENCES `national_team`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match` ADD CONSTRAINT `match_winner_national_team_id_fkey` FOREIGN KEY (`winner_national_team_id`) REFERENCES `national_team`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `national_team` ADD CONSTRAINT `national_team_stadium_id_fkey` FOREIGN KEY (`stadium_id`) REFERENCES `stadium`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `player_national_team` ADD CONSTRAINT `player_national_team_player_id_fkey` FOREIGN KEY (`player_id`) REFERENCES `player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `player_national_team` ADD CONSTRAINT `player_national_team_national_team_id_fkey` FOREIGN KEY (`national_team_id`) REFERENCES `national_team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `manager_team` ADD CONSTRAINT `manager_team_manager_id_fkey` FOREIGN KEY (`manager_id`) REFERENCES `manager`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `manager_team` ADD CONSTRAINT `manager_team_team_id_fkey` FOREIGN KEY (`team_id`) REFERENCES `team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `manager_national_team` ADD CONSTRAINT `manager_national_team_manager_id_fkey` FOREIGN KEY (`manager_id`) REFERENCES `manager`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `manager_national_team` ADD CONSTRAINT `manager_national_team_national_team_id_fkey` FOREIGN KEY (`national_team_id`) REFERENCES `national_team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
