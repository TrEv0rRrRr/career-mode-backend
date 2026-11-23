/*
  Warnings:

  - You are about to drop the column `away_national_club_id` on the `match` table. All the data in the column will be lost.
  - You are about to drop the column `home_national_club_id` on the `match` table. All the data in the column will be lost.
  - You are about to drop the column `winner_national_club_id` on the `match` table. All the data in the column will be lost.
  - You are about to drop the `manager_national_club` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `national_club_competition_participant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `player_national_club` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `manager_national_club` DROP FOREIGN KEY `manager_national_club_manager_id_fkey`;

-- DropForeignKey
ALTER TABLE `manager_national_club` DROP FOREIGN KEY `manager_national_club_national_club_id_fkey`;

-- DropForeignKey
ALTER TABLE `match` DROP FOREIGN KEY `match_away_national_club_id_fkey`;

-- DropForeignKey
ALTER TABLE `match` DROP FOREIGN KEY `match_home_national_club_id_fkey`;

-- DropForeignKey
ALTER TABLE `match` DROP FOREIGN KEY `match_winner_national_club_id_fkey`;

-- DropForeignKey
ALTER TABLE `national_club_competition_participant` DROP FOREIGN KEY `national_club_competition_participant_competition_edition_i_fkey`;

-- DropForeignKey
ALTER TABLE `national_club_competition_participant` DROP FOREIGN KEY `national_club_competition_participant_national_club_id_fkey`;

-- DropForeignKey
ALTER TABLE `player_national_club` DROP FOREIGN KEY `player_national_club_national_club_id_fkey`;

-- DropForeignKey
ALTER TABLE `player_national_club` DROP FOREIGN KEY `player_national_club_player_id_fkey`;

-- DropIndex
DROP INDEX `match_away_national_club_id_fkey` ON `match`;

-- DropIndex
DROP INDEX `match_home_national_club_id_fkey` ON `match`;

-- DropIndex
DROP INDEX `match_winner_national_club_id_fkey` ON `match`;

-- AlterTable
ALTER TABLE `match` DROP COLUMN `away_national_club_id`,
    DROP COLUMN `home_national_club_id`,
    DROP COLUMN `winner_national_club_id`,
    ADD COLUMN `away_national_team_id` INTEGER NULL,
    ADD COLUMN `home_national_team_id` INTEGER NULL,
    ADD COLUMN `winner_national_team_id` INTEGER NULL;

-- DropTable
DROP TABLE `manager_national_club`;

-- DropTable
DROP TABLE `national_club_competition_participant`;

-- DropTable
DROP TABLE `player_national_club`;

-- CreateTable
CREATE TABLE `national_team_competition_participant` (
    `national_team_id` INTEGER NOT NULL,
    `competition_edition_id` INTEGER NOT NULL,
    `points` INTEGER NULL,
    `position` INTEGER NULL,
    `group` VARCHAR(191) NULL,
    `played` INTEGER NOT NULL DEFAULT 0,
    `wins` INTEGER NOT NULL DEFAULT 0,
    `draws` INTEGER NOT NULL DEFAULT 0,
    `losses` INTEGER NOT NULL DEFAULT 0,
    `gf` INTEGER NOT NULL DEFAULT 0,
    `ga` INTEGER NOT NULL DEFAULT 0,
    `gd` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`national_team_id`, `competition_edition_id`)
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
ALTER TABLE `match` ADD CONSTRAINT `match_home_national_team_id_fkey` FOREIGN KEY (`home_national_team_id`) REFERENCES `national_team`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match` ADD CONSTRAINT `match_away_national_team_id_fkey` FOREIGN KEY (`away_national_team_id`) REFERENCES `national_team`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match` ADD CONSTRAINT `match_winner_national_team_id_fkey` FOREIGN KEY (`winner_national_team_id`) REFERENCES `national_team`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `national_team_competition_participant` ADD CONSTRAINT `national_team_competition_participant_competition_edition_i_fkey` FOREIGN KEY (`competition_edition_id`) REFERENCES `competition_edition`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `national_team_competition_participant` ADD CONSTRAINT `national_team_competition_participant_national_team_id_fkey` FOREIGN KEY (`national_team_id`) REFERENCES `national_team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `player_national_team` ADD CONSTRAINT `player_national_team_player_id_fkey` FOREIGN KEY (`player_id`) REFERENCES `player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `player_national_team` ADD CONSTRAINT `player_national_team_national_team_id_fkey` FOREIGN KEY (`national_team_id`) REFERENCES `national_team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `manager_national_team` ADD CONSTRAINT `manager_national_team_manager_id_fkey` FOREIGN KEY (`manager_id`) REFERENCES `manager`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `manager_national_team` ADD CONSTRAINT `manager_national_team_national_team_id_fkey` FOREIGN KEY (`national_team_id`) REFERENCES `national_team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
