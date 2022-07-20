import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

const include = Prisma.validator<Prisma.FollowScoutInclude>()({
  scout: true,
  follower: true,
});

@Injectable()
export class FollowScoutsService {
  constructor(private readonly prisma: PrismaService) {}

  create(scoutId: number, userId: number) {
    return this.prisma.followScout.create({
      data: {
        scout: { connect: { id: scoutId } },
        follower: { connect: { id: userId } },
      },
      include,
    });
  }

  remove(scoutId: number, userId: number) {
    return this.prisma.followScout.delete({
      where: {
        scoutId_followerId: { scoutId, followerId: userId },
      },
      include,
    });
  }
}
