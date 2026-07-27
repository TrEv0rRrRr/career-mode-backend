/*
  Warnings:

  - You are about to drop the `team_season` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `team_season` DROP FOREIGN KEY `team_season_competition_id_fkey`;

-- DropForeignKey
ALTER TABLE `team_season` DROP FOREIGN KEY `team_season_season_id_fkey`;

-- DropForeignKey
ALTER TABLE `team_season` DROP FOREIGN KEY `team_season_team_id_fkey`;

-- DropTable
DROP TABLE `team_season`;

-- CreateTable
CREATE TABLE `competition_participant` (
    `team_id` INTEGER NOT NULL,
    `competition_edition_id` INTEGER NOT NULL,

    PRIMARY KEY (`team_id`, `competition_edition_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `competition_participant` ADD CONSTRAINT `competition_participant_competition_edition_id_fkey` FOREIGN KEY (`competition_edition_id`) REFERENCES `competition_edition`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `competition_participant` ADD CONSTRAINT `competition_participant_team_id_fkey` FOREIGN KEY (`team_id`) REFERENCES `team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
