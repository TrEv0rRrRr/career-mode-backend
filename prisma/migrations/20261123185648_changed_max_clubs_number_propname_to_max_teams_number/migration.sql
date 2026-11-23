/*
  Warnings:

  - You are about to drop the column `maxClubsNumber` on the `competition` table. All the data in the column will be lost.
  - Added the required column `maxTeamsNumber` to the `competition` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `competition` DROP COLUMN `maxClubsNumber`,
    ADD COLUMN `maxTeamsNumber` INTEGER NOT NULL;
