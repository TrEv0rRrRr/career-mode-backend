/*
  Warnings:

  - You are about to drop the column `round` on the `match` table. All the data in the column will be lost.
  - Added the required column `finish_type` to the `match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `match` DROP COLUMN `round`,
    ADD COLUMN `away_penalty_goals` INTEGER NULL,
    ADD COLUMN `finish_type` ENUM('REGULAR_TIME', 'EXTRA_TIME', 'PENALTIES') NOT NULL,
    ADD COLUMN `home_penalty_goals` INTEGER NULL,
    ADD COLUMN `matchday` INTEGER NULL,
    ADD COLUMN `type` ENUM('LEAGUE', 'PLAYOFF', 'GROUP_STAGE', 'ROUND_OF_16', 'QUARTER_FINAL', 'SEMI_FINAL', 'FINAL') NOT NULL,
    MODIFY `home_goals` INTEGER NOT NULL DEFAULT 0,
    MODIFY `away_goals` INTEGER NOT NULL DEFAULT 0;
