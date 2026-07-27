/*
  Warnings:

  - Added the required column `maxTeamsNumber` to the `competition` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `competition` ADD COLUMN `groups` INTEGER NULL,
    ADD COLUMN `hasThirdPlaceMatch` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `hasTwoLeggedKnockout` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `maxTeamsNumber` INTEGER NOT NULL,
    ADD COLUMN `teamsPerGroup` INTEGER NULL;
