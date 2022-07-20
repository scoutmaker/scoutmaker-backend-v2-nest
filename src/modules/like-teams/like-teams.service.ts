import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

const include = Prisma.validator<Prisma.LikeTeamInclude>()({
  team: true,
  user: true,
});

@Injectable()
export class LikeTeamsService {
  constructor(private readonly prisma: PrismaService) {}

  like(teamId: number, userId: number) {
    return this.prisma.likeTeam.create({
      data: {
        team: { connect: { id: teamId } },
        user: { connect: { id: userId } },
      },
      include,
    });
  }

  unlike(teamId: number, userId: number) {
    return this.prisma.likeTeam.delete({
      where: {
        teamId_userId: { teamId, userId },
      },
      include,
    });
  }
}
