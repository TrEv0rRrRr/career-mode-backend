/*
  Warnings:

  - Added the required column `jersey_number` to the `player` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `player` ADD COLUMN `jersey_number` INTEGER NOT NULL;
