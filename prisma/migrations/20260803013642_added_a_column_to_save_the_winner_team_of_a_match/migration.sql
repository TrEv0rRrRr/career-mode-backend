-- AlterTable
ALTER TABLE `match` ADD COLUMN `winner_team_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `match` ADD CONSTRAINT `match_winner_team_id_fkey` FOREIGN KEY (`winner_team_id`) REFERENCES `team`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
