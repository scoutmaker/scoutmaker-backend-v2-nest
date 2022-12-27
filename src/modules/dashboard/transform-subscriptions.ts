import { Prisma } from '@prisma/client';

import { FormattedSubscription } from '../../types/formatted-subscription';

export function transformMatchSubscriptions(
  subscriptions: FormattedSubscription[],
): Prisma.MatchWhereInput {
  return {
    OR: subscriptions.map(
      ({ competitionGroups, competitions, endDate, startDate }) => ({
        OR: [
          { competitionId: { in: competitions } },
          { groupId: { in: competitionGroups } },
        ],
        date: { gte: startDate, lte: endDate },
        season: {
          startDate: { lte: endDate },
          endDate: { gte: startDate },
        },
      }),
    ),
  };
}

export function transformPlayerSubscriptions(
  subscriptions: FormattedSubscription[],
): Prisma.PlayerWhereInput {
  return {
    OR: subscriptions.map(
      ({ competitionGroups, competitions, endDate, startDate }) => ({
        teams: {
          some: {
            startDate: { lte: endDate },
            endDate: { gte: startDate },
            team: {
              competitions: {
                some: {
                  OR: [
                    { competitionId: { in: competitions } },
                    { groupId: { in: competitionGroups } },
                  ],
                  season: {
                    startDate: { lte: endDate },
                    endDate: { gte: startDate },
                  },
                },
              },
            },
          },
        },
      }),
    ),
  };
}

export function transformObservationSubscriptions(
  subscriptions: FormattedSubscription[],
): Prisma.NoteWhereInput | Prisma.ReportWhereInput {
  return {
    OR: subscriptions.map(
      ({ competitions, startDate, competitionGroups, endDate }) => ({
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        meta: {
          OR: [
            { competitionId: { in: competitions } },
            { competitionGroupId: { in: competitionGroups } },
          ],
        },
      }),
    ),
  };
}
