/*
  Warnings:

  - A unique constraint covering the columns `[userId,isActive]` on the table `MatchAttendance` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "MatchAttendance_isActive_key";

-- CreateIndex
CREATE UNIQUE INDEX "MatchAttendance_userId_isActive_key" ON "MatchAttendance"("userId", "isActive");
