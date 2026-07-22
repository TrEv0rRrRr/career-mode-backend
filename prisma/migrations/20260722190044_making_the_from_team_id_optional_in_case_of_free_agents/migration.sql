-- DropForeignKey
ALTER TABLE `transfer` DROP FOREIGN KEY `transfer_from_team_id_fkey`;

-- DropIndex
DROP INDEX `transfer_from_team_id_fkey` ON `transfer`;

-- AlterTable
ALTER TABLE `transfer` MODIFY `from_team_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `transfer` ADD CONSTRAINT `transfer_from_team_id_fkey` FOREIGN KEY (`from_team_id`) REFERENCES `team`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
