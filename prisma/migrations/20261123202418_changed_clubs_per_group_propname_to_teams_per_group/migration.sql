/*
  Warnings:

  - You are about to drop the column `clubsPerGroup` on the `competition` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `competition` DROP COLUMN `clubsPerGroup`,
    ADD COLUMN `teamsPerGroup` INTEGER NULL;
