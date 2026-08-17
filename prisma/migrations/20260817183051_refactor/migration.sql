/*
  Warnings:

  - You are about to drop the column `points` on the `team_season_stats` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `team_season_stats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `competition_participant` ADD COLUMN `draws` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `ga` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `gd` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `gf` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `group` VARCHAR(191) NULL,
    ADD COLUMN `losses` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `played` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `points` INTEGER NULL,
    ADD COLUMN `wins` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `team_season_stats` DROP COLUMN `points`,
    DROP COLUMN `position`;
