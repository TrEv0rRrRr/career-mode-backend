/*
  Warnings:

  - You are about to drop the column `year` on the `season` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `season` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `season` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_date` to the `season` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `season` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `season_year_key` ON `season`;

-- AlterTable
ALTER TABLE `season` DROP COLUMN `year`,
    ADD COLUMN `code` VARCHAR(191) NOT NULL,
    ADD COLUMN `end_date` DATE NOT NULL,
    ADD COLUMN `start_date` DATE NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `season_code_key` ON `season`(`code`);
