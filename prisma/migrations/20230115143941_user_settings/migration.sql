-- AlterTable
ALTER TABLE "User" ADD COLUMN     "reportBackgroundImageId" TEXT,
ADD COLUMN     "reportTemplateId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_reportBackgroundImageId_fkey" FOREIGN KEY ("reportBackgroundImageId") REFERENCES "ReportBackgroundImage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_reportTemplateId_fkey" FOREIGN KEY ("reportTemplateId") REFERENCES "ReportTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
