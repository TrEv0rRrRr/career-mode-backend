/*
  Warnings:

  - You are about to drop the `knockout_round_club` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `national_club` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `knockout_round_club` DROP FOREIGN KEY `knockout_round_club_club_id_fkey`;

-- DropForeignKey
ALTER TABLE `knockout_round_club` DROP FOREIGN KEY `knockout_round_club_knockout_round_id_fkey`;

-- DropForeignKey
ALTER TABLE `manager_national_club` DROP FOREIGN KEY `manager_national_club_national_club_id_fkey`;

-- DropForeignKey
ALTER TABLE `match` DROP FOREIGN KEY `match_away_national_club_id_fkey`;

-- DropForeignKey
ALTER TABLE `match` DROP FOREIGN KEY `match_home_national_club_id_fkey`;

-- DropForeignKey
ALTER TABLE `match` DROP FOREIGN KEY `match_winner_national_club_id_fkey`;

-- DropForeignKey
ALTER TABLE `national_club` DROP FOREIGN KEY `national_club_stadium_id_fkey`;

-- DropForeignKey
ALTER TABLE `national_club_competition_participant` DROP FOREIGN KEY `national_club_competition_participant_national_club_id_fkey`;

-- DropForeignKey
ALTER TABLE `player_national_club` DROP FOREIGN KEY `player_national_club_national_club_id_fkey`;

-- DropIndex
DROP INDEX `manager_national_club_national_club_id_fkey` ON `manager_national_club`;

-- DropIndex
DROP INDEX `match_away_national_club_id_fkey` ON `match`;

-- DropIndex
DROP INDEX `match_home_national_club_id_fkey` ON `match`;

-- DropIndex
DROP INDEX `match_winner_national_club_id_fkey` ON `match`;

-- DropIndex
DROP INDEX `player_national_club_national_club_id_fkey` ON `player_national_club`;

-- DropTable
DROP TABLE `knockout_round_club`;

-- DropTable
DROP TABLE `national_club`;

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
    `confederation` ENUM('UEFA', 'CONMEBOL', 'CONCACAF', 'AFC', 'CAF', 'OFC') NOT NULL,

    UNIQUE INDEX `national_team_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `knockout_round_team` (
    `knockout_round_id` INTEGER NOT NULL,
    `club_id` INTEGER NOT NULL,

    PRIMARY KEY (`knockout_round_id`, `club_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `match` ADD CONSTRAINT `match_home_national_club_id_fkey` FOREIGN KEY (`home_national_club_id`) REFERENCES `national_team`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match` ADD CONSTRAINT `match_away_national_club_id_fkey` FOREIGN KEY (`away_national_club_id`) REFERENCES `national_team`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match` ADD CONSTRAINT `match_winner_national_club_id_fkey` FOREIGN KEY (`winner_national_club_id`) REFERENCES `national_team`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `national_team` ADD CONSTRAINT `national_team_stadium_id_fkey` FOREIGN KEY (`stadium_id`) REFERENCES `stadium`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `knockout_round_team` ADD CONSTRAINT `knockout_round_team_knockout_round_id_fkey` FOREIGN KEY (`knockout_round_id`) REFERENCES `knockout_round`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `knockout_round_team` ADD CONSTRAINT `knockout_round_team_club_id_fkey` FOREIGN KEY (`club_id`) REFERENCES `club`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `national_club_competition_participant` ADD CONSTRAINT `national_club_competition_participant_national_club_id_fkey` FOREIGN KEY (`national_club_id`) REFERENCES `national_team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `player_national_club` ADD CONSTRAINT `player_national_club_national_club_id_fkey` FOREIGN KEY (`national_club_id`) REFERENCES `national_team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `manager_national_club` ADD CONSTRAINT `manager_national_club_national_club_id_fkey` FOREIGN KEY (`national_club_id`) REFERENCES `national_team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
