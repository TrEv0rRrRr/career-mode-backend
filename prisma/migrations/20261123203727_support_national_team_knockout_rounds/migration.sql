-- AlterTable
ALTER TABLE `competition_edition` ADD COLUMN `runner_up_national_team_id` INTEGER NULL,
    ADD COLUMN `winner_national_team_id` INTEGER NULL;

-- CreateTable
CREATE TABLE `knockout_round_national_team` (
    `knockout_round_id` INTEGER NOT NULL,
    `national_team_id` INTEGER NOT NULL,

    PRIMARY KEY (`knockout_round_id`, `national_team_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `knockout_round_national_team` ADD CONSTRAINT `knockout_round_national_team_knockout_round_id_fkey` FOREIGN KEY (`knockout_round_id`) REFERENCES `knockout_round`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `knockout_round_national_team` ADD CONSTRAINT `knockout_round_national_team_national_team_id_fkey` FOREIGN KEY (`national_team_id`) REFERENCES `national_team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `competition_edition` ADD CONSTRAINT `competition_edition_winner_national_team_id_fkey` FOREIGN KEY (`winner_national_team_id`) REFERENCES `national_team`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `competition_edition` ADD CONSTRAINT `competition_edition_runner_up_national_team_id_fkey` FOREIGN KEY (`runner_up_national_team_id`) REFERENCES `national_team`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
