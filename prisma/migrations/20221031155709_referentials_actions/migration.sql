-- DropForeignKey
ALTER TABLE "LikeNote" DROP CONSTRAINT "LikeNote_noteId_fkey";

-- DropForeignKey
ALTER TABLE "LikeReport" DROP CONSTRAINT "LikeReport_reportId_fkey";

-- DropForeignKey
ALTER TABLE "NoteMeta" DROP CONSTRAINT "NoteMeta_noteId_fkey";

-- DropForeignKey
ALTER TABLE "ReportMeta" DROP CONSTRAINT "ReportMeta_reportId_fkey";

-- DropForeignKey
ALTER TABLE "ReportSkillAssessment" DROP CONSTRAINT "ReportSkillAssessment_reportId_fkey";

-- DropForeignKey
ALTER TABLE "organization_note_access_control_list" DROP CONSTRAINT "organization_note_access_control_list_noteId_fkey";

-- DropForeignKey
ALTER TABLE "organization_report_access_control_list" DROP CONSTRAINT "organization_report_access_control_list_reportId_fkey";

-- DropForeignKey
ALTER TABLE "user_note_access_control_list" DROP CONSTRAINT "user_note_access_control_list_noteId_fkey";

-- DropForeignKey
ALTER TABLE "user_report_access_control_list" DROP CONSTRAINT "user_report_access_control_list_reportId_fkey";

-- AddForeignKey
ALTER TABLE "NoteMeta" ADD CONSTRAINT "NoteMeta_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportSkillAssessment" ADD CONSTRAINT "ReportSkillAssessment_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportMeta" ADD CONSTRAINT "ReportMeta_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_report_access_control_list" ADD CONSTRAINT "user_report_access_control_list_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_report_access_control_list" ADD CONSTRAINT "organization_report_access_control_list_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_note_access_control_list" ADD CONSTRAINT "user_note_access_control_list_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_note_access_control_list" ADD CONSTRAINT "organization_note_access_control_list_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeReport" ADD CONSTRAINT "LikeReport_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeNote" ADD CONSTRAINT "LikeNote_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;
