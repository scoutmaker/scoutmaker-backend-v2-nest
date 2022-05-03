-- CreateTable
CREATE TABLE "LikeInsiderNote" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "insiderNoteId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "LikeInsiderNote_pkey" PRIMARY KEY ("insiderNoteId","userId")
);

-- AddForeignKey
ALTER TABLE "LikeInsiderNote" ADD CONSTRAINT "LikeInsiderNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeInsiderNote" ADD CONSTRAINT "LikeInsiderNote_insiderNoteId_fkey" FOREIGN KEY ("insiderNoteId") REFERENCES "InsiderNote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
