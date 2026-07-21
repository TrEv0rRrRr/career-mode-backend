/*
  Warnings:

  - A unique constraint covering the columns `[player_id]` on the table `player_position` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `player_position_player_id_key` ON `player_position`(`player_id`);
