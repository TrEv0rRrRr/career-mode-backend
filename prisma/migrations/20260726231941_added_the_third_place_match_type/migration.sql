/*
  Warnings:

  - The values [PLAYOFF] on the enum `match_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `match` MODIFY `type` ENUM('LEAGUE', 'GROUP_STAGE', 'ROUND_OF_16', 'QUARTER_FINAL', 'SEMI_FINAL', 'THIRD_PLACE', 'FINAL') NOT NULL;
