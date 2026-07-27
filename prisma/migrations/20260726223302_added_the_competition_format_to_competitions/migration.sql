/*
  Warnings:

  - Added the required column `format` to the `competition` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `competition` ADD COLUMN `format` ENUM('LEAGUE', 'KNOCKOUT', 'GROUPS_AND_KNOCKOUT', 'SUPER_CUP') NOT NULL;
