/*
  Warnings:

  - Added the required column `start_date` to the `career` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `career` ADD COLUMN `end_date` DATE NULL,
    ADD COLUMN `start_date` DATE NOT NULL;
