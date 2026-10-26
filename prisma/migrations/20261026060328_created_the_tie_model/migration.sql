/*
  Warnings:

  - A unique constraint covering the columns `[tie_id,leg]` on the table `match` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE `tie` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `match_tie_id_leg_key` ON `match`(`tie_id`, `leg`);

-- AddForeignKey
ALTER TABLE `match` ADD CONSTRAINT `match_tie_id_fkey` FOREIGN KEY (`tie_id`) REFERENCES `tie`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
