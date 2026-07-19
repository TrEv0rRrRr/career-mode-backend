/*
  Warnings:

  - You are about to alter the column `weight` on the `player` table. The data in that column could be lost. The data in that column will be cast from `Decimal(5,2)` to `Int`.

*/
-- AlterTable
ALTER TABLE `player` MODIFY `weight` INTEGER NOT NULL;
