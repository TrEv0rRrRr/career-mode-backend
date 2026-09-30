-- CreateTable
CREATE TABLE `knockout_round_team` (
    `knockout_round_id` INTEGER NOT NULL,
    `team_id` INTEGER NOT NULL,

    PRIMARY KEY (`knockout_round_id`, `team_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `knockout_round` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `competition_edition_id` INTEGER NOT NULL,
    `type` ENUM('LEAGUE', 'GROUP_STAGE', 'ROUND_OF_32', 'ROUND_OF_16', 'QUARTER_FINAL', 'SEMI_FINAL', 'THIRD_PLACE', 'FINAL') NOT NULL,
    `completed` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `knockout_round_competition_edition_id_type_key`(`competition_edition_id`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `knockout_round_team` ADD CONSTRAINT `knockout_round_team_knockout_round_id_fkey` FOREIGN KEY (`knockout_round_id`) REFERENCES `knockout_round`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `knockout_round_team` ADD CONSTRAINT `knockout_round_team_team_id_fkey` FOREIGN KEY (`team_id`) REFERENCES `team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `knockout_round` ADD CONSTRAINT `knockout_round_competition_edition_id_fkey` FOREIGN KEY (`competition_edition_id`) REFERENCES `competition_edition`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
