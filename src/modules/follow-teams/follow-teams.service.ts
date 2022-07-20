import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

const include = Prisma.validator<Prisma.FollowTeamInclude>()({
  follower: true,
  team: true,
});
@Injectable()
export class FollowTeamsService {
  constructor(private readonly prisma: PrismaService) {}

  create(teamId: number, userId: number) {
    return this.prisma.followTeam.create({
      data: {
        team: { connect: { id: teamId } },
        follower: { connect: { id: userId } },
      },
      include,
    });
  }

  remove(teamId: number, userId: number) {
    return this.prisma.followTeam.delete({
      where: {
        teamId_followerId: { teamId, followerId: userId },
      },
      include,
    });
  }
}
