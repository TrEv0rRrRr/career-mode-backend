/*
  Warnings:

  - Added the required column `team_id` to the `match_player_stats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `match_player_stats` ADD COLUMN `team_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `match_player_stats` ADD CONSTRAINT `match_player_stats_team_id_fkey` FOREIGN KEY (`team_id`) REFERENCES `team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
