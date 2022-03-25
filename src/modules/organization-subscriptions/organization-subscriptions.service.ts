import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

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
  constructor(private readonly prisma: PrismaService) {}

  create(createOrganizationSubscriptionDto: CreateOrganizationSubscriptionDto) {
    const {
      competitionIds,
      competitionGroupIds,
      organizationId,
      startDate,
      endDate,
    } = createOrganizationSubscriptionDto;

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

    return this.prisma.organizationSubscription.update({
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

  async remove(id: string) {
    await this.prisma.competitionsOnOrganizationSubscriptions.deleteMany({
      where: { subscriptionId: id },
    });
    await this.prisma.competitionGroupsOnOrganizationSubscriptions.deleteMany({
      where: { subscriptionId: id },
    });
    return this.prisma.organizationSubscription.delete({
      where: { id },
      include,
    });
  }
}
