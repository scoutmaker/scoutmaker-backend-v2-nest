-- CreateTable
CREATE TABLE "LikePlayer" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "playerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "LikePlayer_pkey" PRIMARY KEY ("playerId","userId")
);

-- AddForeignKey
ALTER TABLE "LikePlayer" ADD CONSTRAINT "LikePlayer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikePlayer" ADD CONSTRAINT "LikePlayer_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
