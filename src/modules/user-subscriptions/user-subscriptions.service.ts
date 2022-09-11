import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import Redis from 'ioredis';

import {
  CachedFormattedSubscription,
  FormattedSubscription,
} from '../../types/formatted-subscription';
import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserSubscriptionDto } from './dto/create-user-subscription.dto';
import { FindAllUserSubscriptionsDto } from './dto/find-all-user-subscriptions.dto';
import { UpdateUserSubscriptionDto } from './dto/update-user-subscription.dto';
import { UserSubscriptionsPaginationOptionsDto } from './dto/user-subscriptions-pagination-options.dto';

const include = Prisma.validator<Prisma.UserSubscriptionInclude>()({
  user: true,
  competitions: { include: { competition: true } },
  competitionGroups: { include: { group: { include: { competition: true } } } },
});

@Injectable()
export class UserSubscriptionsService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  create(createUserSubscriptionDto: CreateUserSubscriptionDto) {
    const { competitionIds, competitionGroupIds, userId, startDate, endDate } =
      createUserSubscriptionDto;

    return this.prisma.userSubscription.create({
      data: {
        user: { connect: { id: userId } },
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        competitions: {
          createMany: {
            data: competitionIds.map((id) => ({ competitionId: id })),
          },
        },
        competitionGroups:
          competitionGroupIds && competitionGroupIds.length > 0
            ? {
                createMany: {
                  data: competitionGroupIds.map((id) => ({
                    groupId: id,
                  })),
                },
              }
            : undefined,
      },
      include,
    });
  }

  async findAll(
    {
      page,
      limit,
      sortBy,
      sortingOrder,
    }: UserSubscriptionsPaginationOptionsDto,
    {
      userId,
      competitionIds,
      competitionGroupIds,
    }: FindAllUserSubscriptionsDto,
  ) {
    let sort: Prisma.UserSubscriptionOrderByWithRelationInput;

    switch (sortBy) {
      case 'user':
        sort = { user: { lastName: sortingOrder } };
        break;
      default:
        sort = { [sortBy]: sortingOrder };
    }

    const where: Prisma.UserSubscriptionWhereInput = {
      userId,
      competitions: { some: { competitionId: { in: competitionIds } } },
      competitionGroups: { some: { groupId: { in: competitionGroupIds } } },
    };

    const subscriptions = await this.prisma.userSubscription.findMany({
      where,
      take: limit,
      skip: calculateSkip(page, limit),
      orderBy: sort,
      include,
    });

    const total = await this.prisma.userSubscription.count({ where });

    return formatPaginatedResponse({
      docs: subscriptions,
      totalDocs: total,
      limit,
      page,
    });
  }

  findOne(id: string) {
    return this.prisma.userSubscription.findUnique({ where: { id }, include });
  }

  async update(
    id: string,
    updateUserSubscriptionDto: UpdateUserSubscriptionDto,
  ) {
    const { startDate, endDate, competitionIds, competitionGroupIds } =
      updateUserSubscriptionDto;

    const shouldUpdateCompetitions =
      competitionIds && competitionIds.length > 0;
    const shouldUpdateCompetitionGroups =
      competitionGroupIds && competitionGroupIds.length > 0;

    if (shouldUpdateCompetitions) {
      await this.prisma.competitionsOnUserSubscriptions.deleteMany({
        where: { subscriptionId: id },
      });
    }

    if (shouldUpdateCompetitionGroups) {
      await this.prisma.competitionGroupsOnUserSubscriptions.deleteMany({
        where: { subscriptionId: id },
      });
    }

    return this.prisma.userSubscription.update({
      where: { id },
      data: {
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        competitions: shouldUpdateCompetitions
          ? {
              createMany: {
                data: competitionIds.map((id) => ({
                  competitionId: id,
                })),
              },
            }
          : undefined,
        competitionGroups: shouldUpdateCompetitionGroups
          ? {
              createMany: {
                data: competitionGroupIds.map((id) => ({
                  groupId: id,
                })),
              },
            }
          : undefined,
      },
      include,
    });
  }

  async getFormattedForSingleUser(
    userId: string,
  ): Promise<FormattedSubscription[]> {
    const redisKey = `user:${userId}:subscriptions`;

    const cachedSubscriptions = await this.redis.get(redisKey);

    if (cachedSubscriptions) {
      const parsed = JSON.parse(
        cachedSubscriptions,
      ) as CachedFormattedSubscription[];

      return parsed.map((subscription) => ({
        ...subscription,
        startDate: new Date(subscription.startDate),
        endDate: new Date(subscription.endDate),
      }));
    }

    const subscriptions = await this.prisma.userSubscription.findMany({
      where: { userId },
      include: { competitions: true, competitionGroups: true },
    });

    const formattedSubscriptions = subscriptions.map(
      ({ id, startDate, endDate, competitions, competitionGroups }) => ({
        id,
        startDate,
        endDate,
        competitions: competitions.map(({ competitionId }) => competitionId),
        competitionGroups: competitionGroups.map(({ groupId }) => groupId),
      }),
    );

    await this.redis.set(
      redisKey,
      JSON.stringify(formattedSubscriptions),
      'EX',
      60 * 60 * 24,
    );

    return formattedSubscriptions;
  }

  async remove(id: string) {
    await this.prisma.competitionsOnUserSubscriptions.deleteMany({
      where: { subscriptionId: id },
    });
    await this.prisma.competitionGroupsOnUserSubscriptions.deleteMany({
      where: { subscriptionId: id },
    });
    return this.prisma.userSubscription.delete({ where: { id }, include });
  }
}
