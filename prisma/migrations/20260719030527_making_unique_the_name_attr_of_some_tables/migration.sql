/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `competition` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `manager` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `player` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `stadium` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `team` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `competition_name_key` ON `competition`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `manager_name_key` ON `manager`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `player_name_key` ON `player`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `stadium_name_key` ON `stadium`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `team_name_key` ON `team`(`name`);
