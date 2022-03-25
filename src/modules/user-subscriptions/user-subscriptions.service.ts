import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreateUserSubscriptionDto } from './dto/create-user-subscription.dto';
import { UpdateUserSubscriptionDto } from './dto/update-user-subscription.dto';

const include = Prisma.validator<Prisma.UserSubscriptionInclude>()({
  user: true,
  competitions: { include: { competition: true } },
  competitionGroups: { include: { group: { include: { competition: true } } } },
});

@Injectable()
export class UserSubscriptionsService {
  constructor(private readonly prisma: PrismaService) {}

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

  findAll() {
    return this.prisma.userSubscription.findMany({ include });
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
