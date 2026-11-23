/*
  Warnings:

  - You are about to drop the column `team_id` on the `career` table. All the data in the column will be lost.
  - You are about to drop the column `maxTeamsNumber` on the `competition` table. All the data in the column will be lost.
  - You are about to drop the column `teamsPerGroup` on the `competition` table. All the data in the column will be lost.
  - You are about to drop the column `runner_up_team_id` on the `competition_edition` table. All the data in the column will be lost.
  - You are about to drop the column `winner_team_id` on the `competition_edition` table. All the data in the column will be lost.
  - The primary key for the `competition_participant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `team_id` on the `competition_participant` table. All the data in the column will be lost.
  - You are about to drop the column `away_national_team_id` on the `match` table. All the data in the column will be lost.
  - You are about to drop the column `away_team_id` on the `match` table. All the data in the column will be lost.
  - You are about to drop the column `home_national_team_id` on the `match` table. All the data in the column will be lost.
  - You are about to drop the column `home_team_id` on the `match` table. All the data in the column will be lost.
  - You are about to drop the column `winner_national_team_id` on the `match` table. All the data in the column will be lost.
  - You are about to drop the column `winner_team_id` on the `match` table. All the data in the column will be lost.
  - You are about to drop the column `team_id` on the `match_player_stats` table. All the data in the column will be lost.
  - The primary key for the `player_season_stats` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `team_id` on the `player_season_stats` table. All the data in the column will be lost.
  - You are about to drop the column `from_team_id` on the `transfer` table. All the data in the column will be lost.
  - You are about to drop the column `to_team_id` on the `transfer` table. All the data in the column will be lost.
  - You are about to drop the `knockout_round_team` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `manager_national_team` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `manager_team` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `match_team_stats` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `national_team` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `national_team_competition_participant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `player_national_team` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `player_team` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `team` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `team_season_stats` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `club_id` to the `career` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxClubsNumber` to the `competition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `club_id` to the `competition_participant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `club_id` to the `match_player_stats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `club_id` to the `player_season_stats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to_club_id` to the `transfer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `career` DROP FOREIGN KEY `career_team_id_fkey`;

-- DropForeignKey
ALTER TABLE `competition_edition` DROP FOREIGN KEY `competition_edition_runner_up_team_id_fkey`;

-- DropForeignKey
ALTER TABLE `competition_edition` DROP FOREIGN KEY `competition_edition_winner_team_id_fkey`;

-- DropForeignKey
ALTER TABLE `competition_participant` DROP FOREIGN KEY `competition_participant_team_id_fkey`;

-- DropForeignKey
ALTER TABLE `knockout_round_team` DROP FOREIGN KEY `knockout_round_team_knockout_round_id_fkey`;

-- DropForeignKey
ALTER TABLE `knockout_round_team` DROP FOREIGN KEY `knockout_round_team_team_id_fkey`;

-- DropForeignKey
ALTER TABLE `manager_national_team` DROP FOREIGN KEY `manager_national_team_manager_id_fkey`;

-- DropForeignKey
ALTER TABLE `manager_national_team` DROP FOREIGN KEY `manager_national_team_national_team_id_fkey`;

-- DropForeignKey
ALTER TABLE `manager_team` DROP FOREIGN KEY `manager_team_manager_id_fkey`;

-- DropForeignKey
ALTER TABLE `manager_team` DROP FOREIGN KEY `manager_team_team_id_fkey`;

-- DropForeignKey
ALTER TABLE `match` DROP FOREIGN KEY `match_away_national_team_id_fkey`;

-- DropForeignKey
ALTER TABLE `match` DROP FOREIGN KEY `match_away_team_id_fkey`;

-- DropForeignKey
ALTER TABLE `match` DROP FOREIGN KEY `match_home_national_team_id_fkey`;

-- DropForeignKey
ALTER TABLE `match` DROP FOREIGN KEY `match_home_team_id_fkey`;

-- DropForeignKey
ALTER TABLE `match` DROP FOREIGN KEY `match_winner_national_team_id_fkey`;

-- DropForeignKey
ALTER TABLE `match` DROP FOREIGN KEY `match_winner_team_id_fkey`;

-- DropForeignKey
ALTER TABLE `match_player_stats` DROP FOREIGN KEY `match_player_stats_team_id_fkey`;

-- DropForeignKey
ALTER TABLE `match_team_stats` DROP FOREIGN KEY `match_team_stats_match_id_fkey`;

-- DropForeignKey
ALTER TABLE `match_team_stats` DROP FOREIGN KEY `match_team_stats_team_id_fkey`;

-- DropForeignKey
ALTER TABLE `national_team` DROP FOREIGN KEY `national_team_stadium_id_fkey`;

-- DropForeignKey
ALTER TABLE `national_team_competition_participant` DROP FOREIGN KEY `national_team_competition_participant_competition_edition_i_fkey`;

-- DropForeignKey
ALTER TABLE `national_team_competition_participant` DROP FOREIGN KEY `national_team_competition_participant_national_team_id_fkey`;

-- DropForeignKey
ALTER TABLE `player_national_team` DROP FOREIGN KEY `player_national_team_national_team_id_fkey`;

-- DropForeignKey
ALTER TABLE `player_national_team` DROP FOREIGN KEY `player_national_team_player_id_fkey`;

-- DropForeignKey
ALTER TABLE `player_season_stats` DROP FOREIGN KEY `player_season_stats_team_id_fkey`;

-- DropForeignKey
ALTER TABLE `player_team` DROP FOREIGN KEY `player_team_player_id_fkey`;

-- DropForeignKey
ALTER TABLE `player_team` DROP FOREIGN KEY `player_team_team_id_fkey`;

-- DropForeignKey
ALTER TABLE `team` DROP FOREIGN KEY `team_league_id_fkey`;

-- DropForeignKey
ALTER TABLE `team` DROP FOREIGN KEY `team_stadium_id_fkey`;

-- DropForeignKey
ALTER TABLE `team_season_stats` DROP FOREIGN KEY `team_season_stats_season_id_fkey`;

-- DropForeignKey
ALTER TABLE `team_season_stats` DROP FOREIGN KEY `team_season_stats_team_id_fkey`;

-- DropForeignKey
ALTER TABLE `transfer` DROP FOREIGN KEY `transfer_from_team_id_fkey`;

-- DropForeignKey
ALTER TABLE `transfer` DROP FOREIGN KEY `transfer_to_team_id_fkey`;

-- DropIndex
DROP INDEX `career_team_id_fkey` ON `career`;

-- DropIndex
DROP INDEX `competition_edition_runner_up_team_id_fkey` ON `competition_edition`;

-- DropIndex
DROP INDEX `competition_edition_winner_team_id_fkey` ON `competition_edition`;

-- DropIndex
DROP INDEX `match_away_national_team_id_fkey` ON `match`;

-- DropIndex
DROP INDEX `match_away_team_id_fkey` ON `match`;

-- DropIndex
DROP INDEX `match_home_national_team_id_fkey` ON `match`;

-- DropIndex
DROP INDEX `match_home_team_id_fkey` ON `match`;

-- DropIndex
DROP INDEX `match_winner_national_team_id_fkey` ON `match`;

-- DropIndex
DROP INDEX `match_winner_team_id_fkey` ON `match`;

-- DropIndex
DROP INDEX `match_player_stats_team_id_fkey` ON `match_player_stats`;

-- DropIndex
DROP INDEX `player_season_stats_team_id_fkey` ON `player_season_stats`;

-- DropIndex
DROP INDEX `transfer_from_team_id_fkey` ON `transfer`;

-- DropIndex
DROP INDEX `transfer_to_team_id_fkey` ON `transfer`;

-- AlterTable
ALTER TABLE `career` DROP COLUMN `team_id`,
    ADD COLUMN `club_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `competition` DROP COLUMN `maxTeamsNumber`,
    DROP COLUMN `teamsPerGroup`,
    ADD COLUMN `clubsPerGroup` INTEGER NULL,
    ADD COLUMN `maxClubsNumber` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `competition_edition` DROP COLUMN `runner_up_team_id`,
    DROP COLUMN `winner_team_id`,
    ADD COLUMN `runner_up_club_id` INTEGER NULL,
    ADD COLUMN `winner_club_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `competition_participant` DROP PRIMARY KEY,
    DROP COLUMN `team_id`,
    ADD COLUMN `club_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`club_id`, `competition_edition_id`);

-- AlterTable
ALTER TABLE `match` DROP COLUMN `away_national_team_id`,
    DROP COLUMN `away_team_id`,
    DROP COLUMN `home_national_team_id`,
    DROP COLUMN `home_team_id`,
    DROP COLUMN `winner_national_team_id`,
    DROP COLUMN `winner_team_id`,
    ADD COLUMN `away_club_id` INTEGER NULL,
    ADD COLUMN `away_national_club_id` INTEGER NULL,
    ADD COLUMN `home_club_id` INTEGER NULL,
    ADD COLUMN `home_national_club_id` INTEGER NULL,
    ADD COLUMN `winner_club_id` INTEGER NULL,
    ADD COLUMN `winner_national_club_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `match_player_stats` DROP COLUMN `team_id`,
    ADD COLUMN `club_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `player_season_stats` DROP PRIMARY KEY,
    DROP COLUMN `team_id`,
    ADD COLUMN `club_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`player_id`, `club_id`, `season_id`);

-- AlterTable
ALTER TABLE `transfer` DROP COLUMN `from_team_id`,
    DROP COLUMN `to_team_id`,
    ADD COLUMN `from_club_id` INTEGER NULL,
    ADD COLUMN `to_club_id` INTEGER NOT NULL;

-- DropTable
DROP TABLE `knockout_round_team`;

-- DropTable
DROP TABLE `manager_national_team`;

-- DropTable
DROP TABLE `manager_team`;

-- DropTable
DROP TABLE `match_team_stats`;

-- DropTable
DROP TABLE `national_team`;

-- DropTable
DROP TABLE `national_team_competition_participant`;

-- DropTable
DROP TABLE `player_national_team`;

-- DropTable
DROP TABLE `player_team`;

-- DropTable
DROP TABLE `team`;

-- DropTable
DROP TABLE `team_season_stats`;

-- CreateTable
CREATE TABLE `club` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `short_name` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `confederation` ENUM('UEFA', 'CONMEBOL', 'CONCACAF', 'AFC', 'CAF', 'OFC') NOT NULL,
    `logo` VARCHAR(191) NULL,
    `foundation_date` DATE NOT NULL,
    `primary_color` VARCHAR(191) NOT NULL,
    `secondary_color` VARCHAR(191) NOT NULL,
    `stadium_id` INTEGER NOT NULL,
    `league_id` INTEGER NOT NULL,

    UNIQUE INDEX `club_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `national_club` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `short_name` VARCHAR(191) NOT NULL,
    `logo` VARCHAR(191) NULL,
    `foundation_date` DATE NOT NULL,
    `primary_color` VARCHAR(191) NOT NULL,
    `secondary_color` VARCHAR(191) NOT NULL,
    `stadium_id` INTEGER NOT NULL,
    `confederation` ENUM('UEFA', 'CONMEBOL', 'CONCACAF', 'AFC', 'CAF', 'OFC') NOT NULL,

    UNIQUE INDEX `national_club_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `knockout_round_club` (
    `knockout_round_id` INTEGER NOT NULL,
    `club_id` INTEGER NOT NULL,

    PRIMARY KEY (`knockout_round_id`, `club_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `club_season_stats` (
    `club_id` INTEGER NOT NULL,
    `season_id` INTEGER NOT NULL,
    `played` INTEGER NOT NULL DEFAULT 0,
    `wins` INTEGER NOT NULL DEFAULT 0,
    `draws` INTEGER NOT NULL DEFAULT 0,
    `losses` INTEGER NOT NULL DEFAULT 0,
    `gf` INTEGER NOT NULL DEFAULT 0,
    `ga` INTEGER NOT NULL DEFAULT 0,
    `gd` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`club_id`, `season_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `national_club_competition_participant` (
    `national_club_id` INTEGER NOT NULL,
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

    PRIMARY KEY (`national_club_id`, `competition_edition_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `match_club_stats` (
    `club_id` INTEGER NOT NULL,
    `match_id` INTEGER NOT NULL,
    `possession` INTEGER NOT NULL DEFAULT 0,
    `shots` INTEGER NOT NULL DEFAULT 0,
    `shots_on_target` INTEGER NOT NULL DEFAULT 0,
    `corners` INTEGER NOT NULL DEFAULT 0,
    `fouls` INTEGER NOT NULL DEFAULT 0,
    `offsides` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`club_id`, `match_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `player_club` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `player_id` INTEGER NOT NULL,
    `club_id` INTEGER NOT NULL,
    `jersey_number` INTEGER NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NULL,

    UNIQUE INDEX `player_club_player_id_club_id_start_date_key`(`player_id`, `club_id`, `start_date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `player_national_club` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `player_id` INTEGER NOT NULL,
    `national_club_id` INTEGER NOT NULL,
    `jersey_number` INTEGER NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NULL,

    UNIQUE INDEX `player_national_club_player_id_national_club_id_start_date_key`(`player_id`, `national_club_id`, `start_date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `manager_club` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `manager_id` INTEGER NOT NULL,
    `club_id` INTEGER NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NULL,

    UNIQUE INDEX `manager_club_manager_id_club_id_start_date_key`(`manager_id`, `club_id`, `start_date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `manager_national_club` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `manager_id` INTEGER NOT NULL,
    `national_club_id` INTEGER NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NULL,

    UNIQUE INDEX `manager_national_club_manager_id_national_club_id_start_date_key`(`manager_id`, `national_club_id`, `start_date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `match` ADD CONSTRAINT `match_home_club_id_fkey` FOREIGN KEY (`home_club_id`) REFERENCES `club`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match` ADD CONSTRAINT `match_away_club_id_fkey` FOREIGN KEY (`away_club_id`) REFERENCES `club`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match` ADD CONSTRAINT `match_winner_club_id_fkey` FOREIGN KEY (`winner_club_id`) REFERENCES `club`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match` ADD CONSTRAINT `match_home_national_club_id_fkey` FOREIGN KEY (`home_national_club_id`) REFERENCES `national_club`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match` ADD CONSTRAINT `match_away_national_club_id_fkey` FOREIGN KEY (`away_national_club_id`) REFERENCES `national_club`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match` ADD CONSTRAINT `match_winner_national_club_id_fkey` FOREIGN KEY (`winner_national_club_id`) REFERENCES `national_club`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transfer` ADD CONSTRAINT `transfer_from_club_id_fkey` FOREIGN KEY (`from_club_id`) REFERENCES `club`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transfer` ADD CONSTRAINT `transfer_to_club_id_fkey` FOREIGN KEY (`to_club_id`) REFERENCES `club`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `career` ADD CONSTRAINT `career_club_id_fkey` FOREIGN KEY (`club_id`) REFERENCES `club`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `club` ADD CONSTRAINT `club_stadium_id_fkey` FOREIGN KEY (`stadium_id`) REFERENCES `stadium`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `club` ADD CONSTRAINT `club_league_id_fkey` FOREIGN KEY (`league_id`) REFERENCES `competition`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `national_club` ADD CONSTRAINT `national_club_stadium_id_fkey` FOREIGN KEY (`stadium_id`) REFERENCES `stadium`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `knockout_round_club` ADD CONSTRAINT `knockout_round_club_knockout_round_id_fkey` FOREIGN KEY (`knockout_round_id`) REFERENCES `knockout_round`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `knockout_round_club` ADD CONSTRAINT `knockout_round_club_club_id_fkey` FOREIGN KEY (`club_id`) REFERENCES `club`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match_player_stats` ADD CONSTRAINT `match_player_stats_club_id_fkey` FOREIGN KEY (`club_id`) REFERENCES `club`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `club_season_stats` ADD CONSTRAINT `club_season_stats_club_id_fkey` FOREIGN KEY (`club_id`) REFERENCES `club`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `club_season_stats` ADD CONSTRAINT `club_season_stats_season_id_fkey` FOREIGN KEY (`season_id`) REFERENCES `season`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `competition_edition` ADD CONSTRAINT `competition_edition_winner_club_id_fkey` FOREIGN KEY (`winner_club_id`) REFERENCES `club`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `competition_edition` ADD CONSTRAINT `competition_edition_runner_up_club_id_fkey` FOREIGN KEY (`runner_up_club_id`) REFERENCES `club`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `competition_participant` ADD CONSTRAINT `competition_participant_club_id_fkey` FOREIGN KEY (`club_id`) REFERENCES `club`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `national_club_competition_participant` ADD CONSTRAINT `national_club_competition_participant_competition_edition_i_fkey` FOREIGN KEY (`competition_edition_id`) REFERENCES `competition_edition`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `national_club_competition_participant` ADD CONSTRAINT `national_club_competition_participant_national_club_id_fkey` FOREIGN KEY (`national_club_id`) REFERENCES `national_club`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match_club_stats` ADD CONSTRAINT `match_club_stats_club_id_fkey` FOREIGN KEY (`club_id`) REFERENCES `club`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match_club_stats` ADD CONSTRAINT `match_club_stats_match_id_fkey` FOREIGN KEY (`match_id`) REFERENCES `match`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `player_season_stats` ADD CONSTRAINT `player_season_stats_club_id_fkey` FOREIGN KEY (`club_id`) REFERENCES `club`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `player_club` ADD CONSTRAINT `player_club_player_id_fkey` FOREIGN KEY (`player_id`) REFERENCES `player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `player_club` ADD CONSTRAINT `player_club_club_id_fkey` FOREIGN KEY (`club_id`) REFERENCES `club`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `player_national_club` ADD CONSTRAINT `player_national_club_player_id_fkey` FOREIGN KEY (`player_id`) REFERENCES `player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `player_national_club` ADD CONSTRAINT `player_national_club_national_club_id_fkey` FOREIGN KEY (`national_club_id`) REFERENCES `national_club`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `manager_club` ADD CONSTRAINT `manager_club_manager_id_fkey` FOREIGN KEY (`manager_id`) REFERENCES `manager`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `manager_club` ADD CONSTRAINT `manager_club_club_id_fkey` FOREIGN KEY (`club_id`) REFERENCES `club`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `manager_national_club` ADD CONSTRAINT `manager_national_club_manager_id_fkey` FOREIGN KEY (`manager_id`) REFERENCES `manager`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `manager_national_club` ADD CONSTRAINT `manager_national_club_national_club_id_fkey` FOREIGN KEY (`national_club_id`) REFERENCES `national_club`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
