-- AlterTable
ALTER TABLE "PlayerPosition" ADD COLUMN     "playerPositionTypeId" TEXT;

-- CreateTable
CREATE TABLE "PlayerPositionType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlayerPositionType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlayerPositionType_code_key" ON "PlayerPositionType"("code");

-- AddForeignKey
ALTER TABLE "PlayerPosition" ADD CONSTRAINT "PlayerPosition_playerPositionTypeId_fkey" FOREIGN KEY ("playerPositionTypeId") REFERENCES "PlayerPositionType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
