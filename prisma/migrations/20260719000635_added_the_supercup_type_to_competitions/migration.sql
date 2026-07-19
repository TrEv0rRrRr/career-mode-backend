-- CreateTable
CREATE TABLE `player` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `birth_date` DATE NOT NULL,
    `nationality` VARCHAR(191) NOT NULL,
    `preferred_foot` ENUM('LEFT', 'RIGHT') NOT NULL,
    `overall` INTEGER NOT NULL,
    `height` DECIMAL(3, 2) NOT NULL,
    `weight` DECIMAL(5, 2) NOT NULL,
    `face` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `manager` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `birth_date` DATE NOT NULL,
    `nationality` VARCHAR(191) NOT NULL,
    `face` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `competition` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('LEAGUE', 'CUP', 'SUPER_CUP', 'INTERNATIONAL') NOT NULL,
    `logo` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stadium` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,
    `capacity` INTEGER NOT NULL,
    `opening_date` DATE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `position` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `position_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `match` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `round` VARCHAR(191) NOT NULL,
    `date` DATE NOT NULL,
    `home_goals` INTEGER NOT NULL,
    `away_goals` INTEGER NOT NULL,
    `status` ENUM('SCHEDULED', 'PLAYED') NOT NULL,
    `stadium_id` INTEGER NOT NULL,
    `home_team_id` INTEGER NOT NULL,
    `away_team_id` INTEGER NOT NULL,
    `competition_edition_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transfer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fee` DECIMAL(15, 2) NOT NULL,
    `date` DATE NOT NULL,
    `type` ENUM('TRANSFER', 'LOAN', 'FREE_AGENT', 'YOUTH_PROMOTION') NOT NULL,
    `player_id` INTEGER NOT NULL,
    `season_id` INTEGER NOT NULL,
    `from_team_id` INTEGER NOT NULL,
    `to_team_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `season` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `year` VARCHAR(191) NOT NULL,
    `notes` VARCHAR(191) NULL,
    `career_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `career` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `manager_name` VARCHAR(191) NOT NULL,
    `team_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `team` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `short_name` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `logo` VARCHAR(191) NULL,
    `foundation_date` DATE NOT NULL,
    `primary_color` VARCHAR(191) NOT NULL,
    `secondary_color` VARCHAR(191) NOT NULL,
    `stadium_id` INTEGER NOT NULL,
    `manager_id` INTEGER NOT NULL,
    `league_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `match_player_stats` (
    `match_id` INTEGER NOT NULL,
    `player_id` INTEGER NOT NULL,
    `goals` INTEGER NOT NULL,
    `assists` INTEGER NOT NULL,
    `rating` DECIMAL(3, 1) NOT NULL,
    `yellow_cards` INTEGER NOT NULL,
    `red_cards` INTEGER NOT NULL,

    PRIMARY KEY (`match_id`, `player_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `team_season_stats` (
    `team_id` INTEGER NOT NULL,
    `season_id` INTEGER NOT NULL,
    `played` INTEGER NOT NULL,
    `wins` INTEGER NOT NULL,
    `draws` INTEGER NOT NULL,
    `losses` INTEGER NOT NULL,
    `gf` INTEGER NOT NULL,
    `ga` INTEGER NOT NULL,
    `gd` INTEGER NOT NULL,
    `points` INTEGER NOT NULL,
    `position` INTEGER NOT NULL,

    PRIMARY KEY (`team_id`, `season_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `competition_edition` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `season_id` INTEGER NOT NULL,
    `competition_id` INTEGER NOT NULL,
    `winner_team_id` INTEGER NULL,

    UNIQUE INDEX `competition_edition_season_id_competition_id_key`(`season_id`, `competition_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `team_season` (
    `team_id` INTEGER NOT NULL,
    `season_id` INTEGER NOT NULL,
    `league_id` INTEGER NOT NULL,

    PRIMARY KEY (`team_id`, `season_id`, `league_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `match_team_stats` (
    `team_id` INTEGER NOT NULL,
    `match_id` INTEGER NOT NULL,
    `possession` INTEGER NOT NULL,
    `shots` INTEGER NOT NULL,
    `shots_on_target` INTEGER NOT NULL,
    `corners` INTEGER NOT NULL,
    `fouls` INTEGER NOT NULL,
    `offsides` INTEGER NOT NULL,

    PRIMARY KEY (`team_id`, `match_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `player_season_stats` (
    `player_id` INTEGER NOT NULL,
    `team_id` INTEGER NOT NULL,
    `season_id` INTEGER NOT NULL,
    `matches` INTEGER NOT NULL,
    `goals` INTEGER NOT NULL,
    `assists` INTEGER NOT NULL,
    `yellow_cards` INTEGER NOT NULL,
    `red_cards` INTEGER NOT NULL,
    `rating` DECIMAL(3, 1) NOT NULL,

    PRIMARY KEY (`player_id`, `team_id`, `season_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PlayerTeam` (
    `player_id` INTEGER NOT NULL,
    `team_id` INTEGER NOT NULL,
    `jersey_number` INTEGER NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NULL,

    PRIMARY KEY (`player_id`, `team_id`, `start_date`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `player_position` (
    `player_id` INTEGER NOT NULL,
    `position_id` INTEGER NOT NULL,
    `is_primary` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`player_id`, `position_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `match` ADD CONSTRAINT `match_stadium_id_fkey` FOREIGN KEY (`stadium_id`) REFERENCES `stadium`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match` ADD CONSTRAINT `match_competition_edition_id_fkey` FOREIGN KEY (`competition_edition_id`) REFERENCES `competition_edition`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match` ADD CONSTRAINT `match_home_team_id_fkey` FOREIGN KEY (`home_team_id`) REFERENCES `team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match` ADD CONSTRAINT `match_away_team_id_fkey` FOREIGN KEY (`away_team_id`) REFERENCES `team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transfer` ADD CONSTRAINT `transfer_player_id_fkey` FOREIGN KEY (`player_id`) REFERENCES `player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transfer` ADD CONSTRAINT `transfer_season_id_fkey` FOREIGN KEY (`season_id`) REFERENCES `season`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transfer` ADD CONSTRAINT `transfer_from_team_id_fkey` FOREIGN KEY (`from_team_id`) REFERENCES `team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transfer` ADD CONSTRAINT `transfer_to_team_id_fkey` FOREIGN KEY (`to_team_id`) REFERENCES `team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `season` ADD CONSTRAINT `season_career_id_fkey` FOREIGN KEY (`career_id`) REFERENCES `career`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `career` ADD CONSTRAINT `career_team_id_fkey` FOREIGN KEY (`team_id`) REFERENCES `team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `team` ADD CONSTRAINT `team_stadium_id_fkey` FOREIGN KEY (`stadium_id`) REFERENCES `stadium`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `team` ADD CONSTRAINT `team_manager_id_fkey` FOREIGN KEY (`manager_id`) REFERENCES `manager`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `team` ADD CONSTRAINT `team_league_id_fkey` FOREIGN KEY (`league_id`) REFERENCES `competition`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match_player_stats` ADD CONSTRAINT `match_player_stats_player_id_fkey` FOREIGN KEY (`player_id`) REFERENCES `player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match_player_stats` ADD CONSTRAINT `match_player_stats_match_id_fkey` FOREIGN KEY (`match_id`) REFERENCES `match`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `team_season_stats` ADD CONSTRAINT `team_season_stats_team_id_fkey` FOREIGN KEY (`team_id`) REFERENCES `team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `team_season_stats` ADD CONSTRAINT `team_season_stats_season_id_fkey` FOREIGN KEY (`season_id`) REFERENCES `season`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `competition_edition` ADD CONSTRAINT `competition_edition_season_id_fkey` FOREIGN KEY (`season_id`) REFERENCES `season`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `competition_edition` ADD CONSTRAINT `competition_edition_competition_id_fkey` FOREIGN KEY (`competition_id`) REFERENCES `competition`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `competition_edition` ADD CONSTRAINT `competition_edition_winner_team_id_fkey` FOREIGN KEY (`winner_team_id`) REFERENCES `team`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `team_season` ADD CONSTRAINT `team_season_season_id_fkey` FOREIGN KEY (`season_id`) REFERENCES `season`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `team_season` ADD CONSTRAINT `team_season_league_id_fkey` FOREIGN KEY (`league_id`) REFERENCES `competition`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `team_season` ADD CONSTRAINT `team_season_team_id_fkey` FOREIGN KEY (`team_id`) REFERENCES `team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match_team_stats` ADD CONSTRAINT `match_team_stats_team_id_fkey` FOREIGN KEY (`team_id`) REFERENCES `team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match_team_stats` ADD CONSTRAINT `match_team_stats_match_id_fkey` FOREIGN KEY (`match_id`) REFERENCES `match`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `player_season_stats` ADD CONSTRAINT `player_season_stats_player_id_fkey` FOREIGN KEY (`player_id`) REFERENCES `player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `player_season_stats` ADD CONSTRAINT `player_season_stats_team_id_fkey` FOREIGN KEY (`team_id`) REFERENCES `team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `player_season_stats` ADD CONSTRAINT `player_season_stats_season_id_fkey` FOREIGN KEY (`season_id`) REFERENCES `season`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlayerTeam` ADD CONSTRAINT `PlayerTeam_player_id_fkey` FOREIGN KEY (`player_id`) REFERENCES `player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlayerTeam` ADD CONSTRAINT `PlayerTeam_team_id_fkey` FOREIGN KEY (`team_id`) REFERENCES `team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `player_position` ADD CONSTRAINT `player_position_player_id_fkey` FOREIGN KEY (`player_id`) REFERENCES `player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `player_position` ADD CONSTRAINT `player_position_position_id_fkey` FOREIGN KEY (`position_id`) REFERENCES `position`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
