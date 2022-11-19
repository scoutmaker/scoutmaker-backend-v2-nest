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
import { CreateOrganizationSubscriptionDto } from './dto/create-organization-subscription.dto';
import { FindAllOrganizationSubscriptionsDto } from './dto/find-all-organization-subscriptions.dto';
import { OrganizationSubscriptionsPaginationOptionsDto } from './dto/organization-subscriptions-pagination-options.dto';
import { UpdateOrganizationSubscriptionDto } from './dto/update-organization-subscription.dto';

const include = Prisma.validator<Prisma.OrganizationSubscriptionInclude>()({
  organization: true,
  competitions: { include: { competition: true } },
  competitionGroups: { include: { group: { include: { competition: true } } } },
});

@Injectable()
export class OrganizationSubscriptionsService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  private getFormattedRedisKey(organizationId: string) {
    return `organization:${organizationId}:subscriptions`;
  }

  private async deleteFormattedFromCache(organizationId: string) {
    await this.redis.del(this.getFormattedRedisKey(organizationId));
  }

  create(createOrganizationSubscriptionDto: CreateOrganizationSubscriptionDto) {
    const {
      competitionIds,
      competitionGroupIds,
      organizationId,
      startDate,
      endDate,
    } = createOrganizationSubscriptionDto;

    this.deleteFormattedFromCache(organizationId);

    return this.prisma.organizationSubscription.create({
      data: {
        organization: { connect: { id: organizationId } },
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
    }: OrganizationSubscriptionsPaginationOptionsDto,
    {
      organizationId,
      competitionIds,
      competitionGroupIds,
    }: FindAllOrganizationSubscriptionsDto,
  ) {
    let sort: Prisma.OrganizationSubscriptionOrderByWithRelationInput;

    switch (sortBy) {
      case 'organization':
        sort = { organization: { name: sortingOrder } };
        break;
      default:
        sort = { [sortBy]: sortingOrder };
    }

    const where: Prisma.OrganizationSubscriptionWhereInput = {
      organizationId,
      competitions: competitionIds
        ? { some: { competitionId: { in: competitionIds } } }
        : undefined,
      competitionGroups: competitionGroupIds
        ? { some: { groupId: { in: competitionGroupIds } } }
        : undefined,
    };

    const subscriptions = await this.prisma.organizationSubscription.findMany({
      where,
      take: limit,
      skip: calculateSkip(page, limit),
      orderBy: sort,
      include,
    });

    const total = await this.prisma.organizationSubscription.count({ where });

    return formatPaginatedResponse({
      docs: subscriptions,
      totalDocs: total,
      limit,
      page,
    });
  }

  findOne(id: string) {
    return this.prisma.organizationSubscription.findUnique({
      where: { id },
      include,
    });
  }

  async update(
    id: string,
    updateOrganizationSubscriptionDto: UpdateOrganizationSubscriptionDto,
  ) {
    const { startDate, endDate, competitionIds, competitionGroupIds } =
      updateOrganizationSubscriptionDto;

    const shouldUpdateCompetitions =
      competitionIds && competitionIds.length > 0;
    const shouldUpdateCompetitionGroups =
      competitionGroupIds && competitionGroupIds.length > 0;

    if (shouldUpdateCompetitions) {
      await this.prisma.competitionsOnOrganizationSubscriptions.deleteMany({
        where: { subscriptionId: id },
      });
    }

    if (shouldUpdateCompetitionGroups) {
      await this.prisma.competitionGroupsOnOrganizationSubscriptions.deleteMany(
        {
          where: { subscriptionId: id },
        },
      );
    }

    const updatedSubsripiton =
      await this.prisma.organizationSubscription.update({
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

    this.deleteFormattedFromCache(updatedSubsripiton.organizationId);

    return updatedSubsripiton;
  }

  async getFormattedForSingleOrganization(
    organizationId?: string,
  ): Promise<FormattedSubscription[] | null> {
    if (!organizationId) {
      return null;
    }

    const redisKey = this.getFormattedRedisKey(organizationId);
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

    const subscriptions = await this.prisma.organizationSubscription.findMany({
      where: { organizationId },
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
    await this.prisma.competitionsOnOrganizationSubscriptions.deleteMany({
      where: { subscriptionId: id },
    });
    await this.prisma.competitionGroupsOnOrganizationSubscriptions.deleteMany({
      where: { subscriptionId: id },
    });

    const deletedSubscription =
      await this.prisma.organizationSubscription.delete({
        where: { id },
        include,
      });

    await this.deleteFormattedFromCache(deletedSubscription.organizationId);
    return deletedSubscription;
  }
}
