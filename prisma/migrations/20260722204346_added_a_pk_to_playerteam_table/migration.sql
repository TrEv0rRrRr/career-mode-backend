/*
  Warnings:

  - You are about to drop the `playerteam` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `playerteam` DROP FOREIGN KEY `PlayerTeam_player_id_fkey`;

-- DropForeignKey
ALTER TABLE `playerteam` DROP FOREIGN KEY `PlayerTeam_team_id_fkey`;

-- DropTable
DROP TABLE `playerteam`;

-- CreateTable
CREATE TABLE `player_team` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `player_id` INTEGER NOT NULL,
    `team_id` INTEGER NOT NULL,
    `jersey_number` INTEGER NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NULL,

    UNIQUE INDEX `player_team_player_id_team_id_start_date_key`(`player_id`, `team_id`, `start_date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `player_team` ADD CONSTRAINT `player_team_player_id_fkey` FOREIGN KEY (`player_id`) REFERENCES `player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `player_team` ADD CONSTRAINT `player_team_team_id_fkey` FOREIGN KEY (`team_id`) REFERENCES `team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
