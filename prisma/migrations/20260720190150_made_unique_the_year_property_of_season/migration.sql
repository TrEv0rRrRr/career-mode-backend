/*
  Warnings:

  - A unique constraint covering the columns `[year]` on the table `season` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `season_year_key` ON `season`(`year`);
