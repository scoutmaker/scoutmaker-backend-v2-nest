-- DropForeignKey
ALTER TABLE "Club" DROP CONSTRAINT "Club_regionId_fkey";

-- AlterTable
ALTER TABLE "Club" ALTER COLUMN "regionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Club" ADD CONSTRAINT "Club_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;
