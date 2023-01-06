-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "roleId" TEXT;

-- CreateTable
CREATE TABLE "PlayerRole" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "altName" TEXT,
    "description" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "positionTypeId" TEXT NOT NULL,

    CONSTRAINT "PlayerRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerRoleExample" (
    "id" TEXT NOT NULL,
    "player" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "PlayerRoleExample_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "PlayerRole"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerRole" ADD CONSTRAINT "PlayerRole_positionTypeId_fkey" FOREIGN KEY ("positionTypeId") REFERENCES "PlayerPositionType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerRoleExample" ADD CONSTRAINT "PlayerRoleExample_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "PlayerRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
