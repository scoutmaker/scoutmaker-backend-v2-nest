import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FollowScoutsService {
  constructor(private readonly prisma: PrismaService) {}

  create(scoutId: string, userId: string) {
    return this.prisma.followScout.create({
      data: {
        scout: { connect: { id: scoutId } },
        follower: { connect: { id: userId } },
      },
    });
  }

  remove(scoutId: string, userId: string) {
    return this.prisma.followScout.delete({
      where: {
        scoutId_followerId: { scoutId, followerId: userId },
      },
    });
  }
}
