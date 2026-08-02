-- AlterTable
ALTER TABLE `competition_edition` ADD COLUMN `final_stadium_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `competition_edition` ADD CONSTRAINT `competition_edition_final_stadium_id_fkey` FOREIGN KEY (`final_stadium_id`) REFERENCES `stadium`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
