/*
  Warnings:

  - You are about to drop the column `teamId` on the `competition_edition` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `competition_edition` DROP FOREIGN KEY `competition_edition_teamId_fkey`;

-- DropIndex
DROP INDEX `competition_edition_teamId_fkey` ON `competition_edition`;

-- AlterTable
ALTER TABLE `competition_edition` DROP COLUMN `teamId`;
