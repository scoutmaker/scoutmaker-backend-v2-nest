-- AlterTable
ALTER TABLE "RecentAveragePercentageRatingsOnPlayers" ADD COLUMN     "last12MonthsNotesCount" DOUBLE PRECISION,
ADD COLUMN     "last12MonthsReportsCount" DOUBLE PRECISION,
ADD COLUMN     "last12MonthsTotalCount" DOUBLE PRECISION,
ADD COLUMN     "last3MonthsNotesCount" DOUBLE PRECISION,
ADD COLUMN     "last3MonthsReportsCount" DOUBLE PRECISION,
ADD COLUMN     "last3MonthsTotalCount" DOUBLE PRECISION,
ADD COLUMN     "last6MonthsNotesCount" DOUBLE PRECISION,
ADD COLUMN     "last6MonthsReportsCount" DOUBLE PRECISION,
ADD COLUMN     "last6MonthsTotalCount" DOUBLE PRECISION,
ADD COLUMN     "lastMonthNotesCount" DOUBLE PRECISION,
ADD COLUMN     "lastMonthReportsCount" DOUBLE PRECISION,
ADD COLUMN     "lastMonthTotalCount" DOUBLE PRECISION;
