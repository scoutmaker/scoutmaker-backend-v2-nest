-- AlterTable
ALTER TABLE "InsiderNote" ADD COLUMN     "createdByRole" "UserRole";

-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "createdByRole" "UserRole";

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "createdByRole" "UserRole";

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "createdByRole" "UserRole";
