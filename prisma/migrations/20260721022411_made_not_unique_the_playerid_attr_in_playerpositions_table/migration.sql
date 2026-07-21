-- DropForeignKey
ALTER TABLE `player_position` DROP FOREIGN KEY `player_position_player_id_fkey`;

-- DropIndex
DROP INDEX `player_position_player_id_key` ON `player_position`;

-- AddForeignKey
ALTER TABLE `team` ADD CONSTRAINT `team_league_id_fkey` FOREIGN KEY (`league_id`) REFERENCES `competition`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
