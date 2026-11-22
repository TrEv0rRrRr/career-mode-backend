/*
  Warnings:

  - Added the required column `completed` to the `season` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `season` ADD COLUMN `completed` BOOLEAN NOT NULL;
