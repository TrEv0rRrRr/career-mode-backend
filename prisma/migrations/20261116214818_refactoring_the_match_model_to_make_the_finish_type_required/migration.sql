/*
  Warnings:

  - Made the column `finish_type` on table `match` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `match` MODIFY `finish_type` ENUM('REGULAR_TIME', 'EXTRA_TIME', 'PENALTIES') NOT NULL;
