/*
  Warnings:

  - You are about to drop the column `manager_id` on the `national_team` table. All the data in the column will be lost.
  - You are about to drop the column `managerId` on the `team` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `national_team` DROP COLUMN `manager_id`;

-- AlterTable
ALTER TABLE `team` DROP COLUMN `managerId`;
