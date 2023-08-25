/*
  Warnings:

  - You are about to alter the column `end_time_in_minutes` on the `user_time_intervals` table. The data in that column could be lost. The data in that column will be cast from `DateTime` to `Int`.
  - You are about to alter the column `start_time_in_minutes` on the `user_time_intervals` table. The data in that column could be lost. The data in that column will be cast from `DateTime` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_user_time_intervals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "week_day" INTEGER NOT NULL,
    "start_time_in_minutes" INTEGER NOT NULL,
    "end_time_in_minutes" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "user_time_intervals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_user_time_intervals" ("end_time_in_minutes", "id", "start_time_in_minutes", "user_id", "week_day") SELECT "end_time_in_minutes", "id", "start_time_in_minutes", "user_id", "week_day" FROM "user_time_intervals";
DROP TABLE "user_time_intervals";
ALTER TABLE "new_user_time_intervals" RENAME TO "user_time_intervals";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
