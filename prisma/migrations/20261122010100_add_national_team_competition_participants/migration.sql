-- CreateTable
CREATE TABLE `national_team_competition_participant` (
    `national_team_id` INTEGER NOT NULL,
    `competition_edition_id` INTEGER NOT NULL,
    `points` INTEGER NULL,
    `position` INTEGER NULL,
    `group` VARCHAR(191) NULL,
    `played` INTEGER NOT NULL DEFAULT 0,
    `wins` INTEGER NOT NULL DEFAULT 0,
    `draws` INTEGER NOT NULL DEFAULT 0,
    `losses` INTEGER NOT NULL DEFAULT 0,
    `gf` INTEGER NOT NULL DEFAULT 0,
    `ga` INTEGER NOT NULL DEFAULT 0,
    `gd` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`national_team_id`, `competition_edition_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `national_team_competition_participant` ADD CONSTRAINT `national_team_competition_participant_competition_edition_id_fkey` FOREIGN KEY (`competition_edition_id`) REFERENCES `competition_edition`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `national_team_competition_participant` ADD CONSTRAINT `national_team_competition_participant_national_team_id_fkey` FOREIGN KEY (`national_team_id`) REFERENCES `national_team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
