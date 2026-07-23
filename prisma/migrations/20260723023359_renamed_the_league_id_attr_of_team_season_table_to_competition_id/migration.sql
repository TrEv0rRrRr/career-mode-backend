/*
  Warnings:

  - The primary key for the `team_season` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `league_id` on the `team_season` table. All the data in the column will be lost.
  - Added the required column `competition_id` to the `team_season` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `team_season` DROP FOREIGN KEY `team_season_league_id_fkey`;

-- DropIndex
DROP INDEX `team_season_league_id_fkey` ON `team_season`;

-- AlterTable
ALTER TABLE `team_season` DROP PRIMARY KEY,
    DROP COLUMN `league_id`,
    ADD COLUMN `competition_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`team_id`, `season_id`, `competition_id`);

-- AddForeignKey
ALTER TABLE `team_season` ADD CONSTRAINT `team_season_competition_id_fkey` FOREIGN KEY (`competition_id`) REFERENCES `competition`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
