/*
  Warnings:

  - Added the required column `knockout_round_id` to the `tie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tie` ADD COLUMN `knockout_round_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `tie` ADD CONSTRAINT `tie_knockout_round_id_fkey` FOREIGN KEY (`knockout_round_id`) REFERENCES `knockout_round`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
