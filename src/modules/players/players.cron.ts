import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlayersCronService {
  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    name: 'update-recent-avg-ratings-player',
  })
  async handleCron() {
    await this.prisma.$queryRaw`
    update "RecentAveragePercentageRatingsOnPlayers"
    SET
    "lastMonth" = tabela."lastMonth",
    "last3Months" = tabela."last3Months", 
    "last6Months" = tabela."last6Months", 
    "last12Months" = tabela."last12Months",
    "playerId" = tabela."player_id",
    --"createdAt" = tabela."createdAt",
    "updatedAt" = tabela."updatedAt",
    "last12MonthsNotesCount" = tabela."last12MonthsNotesCount", 
    "last12MonthsReportsCount" = tabela."last12MonthsReportsCount", 
    "last12MonthsTotalCount" = tabela."last12MonthsTotalCount", 
    "last3MonthsNotesCount" = tabela."last3MonthsNotesCount", 
    "last3MonthsReportsCount" = tabela."last3MonthsReportsCount", 
    "last3MonthsTotalCount" = tabela."last3MonthsTotalCount", 
    "last6MonthsNotesCount" = tabela."last6MonthsNotesCount", 
    "last6MonthsReportsCount" = tabela."last6MonthsReportsCount", 
    "last6MonthsTotalCount" = tabela."last6MonthsTotalCount", 
    "lastMonthNotesCount" = tabela."lastMonthNotesCount", 
    "lastMonthReportsCount" = tabela."lastMonthReportsCount", 
    "lastMonthTotalCount" = tabela."lastMonthTotalCount"
    from (
    select 
    "ratings"."player_id",
    NULL as "createdAt",
    CURRENT_TIMESTAMP as "updatedAt",
    avg(case when current_date - "ratings"."match_date" < 30 then "ratings"."rating" end) as "lastMonth",
    count(case when (current_date - "ratings"."match_date" < 30) then "ratings"."rating" end) as "lastMonthTotalCount" ,
    count(case when (current_date - "ratings"."match_date" < 30) and ("ratings"."note" = 1) then "ratings"."rating" end) as "lastMonthNotesCount" ,
    count(case when (current_date - "ratings"."match_date" < 30) and ("ratings"."report" = 1)  then "ratings"."rating" end) as "lastMonthReportsCount",
    avg(case when current_date - "ratings"."match_date" < 91 then "ratings"."rating" end) as "last3Months",
    count(case when (current_date - "ratings"."match_date" < 91) then "ratings"."rating" end) as "last3MonthsTotalCount" ,
    count(case when (current_date - "ratings"."match_date" < 91) and ("ratings"."note" = 1) then "ratings"."rating" end) as "last3MonthsNotesCount" ,
    count(case when (current_date - "ratings"."match_date" < 91) and ("ratings"."report" = 1)  then "ratings"."rating" end) as "last3MonthsReportsCount",
    avg(case when current_date - "ratings"."match_date" < 183 then "ratings"."rating" end) as "last6Months",
    count(case when (current_date - "ratings"."match_date" < 183) then "ratings"."rating" end) as "last6MonthsTotalCount" ,
    count(case when (current_date - "ratings"."match_date" < 183) and ("ratings"."note" = 1) then "ratings"."rating" end) as "last6MonthsNotesCount" ,
    count(case when (current_date - "ratings"."match_date" < 183) and ("ratings"."report" = 1)  then "ratings"."rating" end) as "last6MonthsReportsCount",
    avg(case when current_date - "ratings"."match_date" < 365 then "ratings"."rating" end) as "last12Months",
    count(case when (current_date - "ratings"."match_date" < 365) then "ratings"."rating" end) as "last12MonthsTotalCount" ,
    count(case when (current_date - "ratings"."match_date" < 365) and ("ratings"."note" = 1) then "ratings"."rating" end) as "last12MonthsNotesCount" ,
    count(case when (current_date - "ratings"."match_date" < 365) and ("ratings"."report" = 1)  then "ratings"."rating" end) as "last12MonthsReportsCount"
    from
        (
        select 
        "Player"."id" as "player_id",
        "Note"."percentageRating" as "rating",
        1 as "note",
        0 as "report",
        cast("Match"."date" as date) as "match_date"
        from "Player"
        inner join "Note" on "Note"."playerId" = "Player"."id"
        inner join "Match" on "Match"."id" = "Note"."matchId"
        union all
        select
        "Player"."id" as "player_id",
        "Report"."percentageRating" as "rating",
        0 as "note",
        1 as "report",
        cast("Match"."date" as date) as "match_date"
        from "Player"
        inner join "Report" on "Report"."playerId" = "Player"."id"
        inner join "Match" on "Match"."id" = "Report"."matchId"
        ) "ratings"
    group by "ratings"."player_id") as tabela
    where tabela."player_id" = "RecentAveragePercentageRatingsOnPlayers"."playerId"
    `;
  }
}
