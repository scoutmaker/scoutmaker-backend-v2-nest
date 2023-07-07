-- CreateTable
CREATE TABLE "RecentAveragePercentageRatingsOnPlayers" (
    "id" TEXT NOT NULL,
    "lastMonth" DOUBLE PRECISION,
    "last3Months" DOUBLE PRECISION,
    "last6Months" DOUBLE PRECISION,
    "last12Months" DOUBLE PRECISION,
    "playerId" TEXT NOT NULL,

    CONSTRAINT "RecentAveragePercentageRatingsOnPlayers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecentAveragePercentageRatingsOnPlayers_playerId_key" ON "RecentAveragePercentageRatingsOnPlayers"("playerId");

-- AddForeignKey
ALTER TABLE "RecentAveragePercentageRatingsOnPlayers" ADD CONSTRAINT "RecentAveragePercentageRatingsOnPlayers_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
