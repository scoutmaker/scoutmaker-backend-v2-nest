import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

const include = Prisma.validator<Prisma.FollowPlayerInclude>()({
  player: { include: { primaryPosition: true, country: true } },
  follower: true,
});

@Injectable()
export class FollowPlayersService {
  constructor(private readonly prisma: PrismaService) {}

  create(playerId: string, userId: string) {
    return this.prisma.followPlayer.create({
      data: {
        player: { connect: { id: playerId } },
        follower: { connect: { id: userId } },
      },
      include,
    });
  }

  remove(playerId: string, userId: string) {
    return this.prisma.followPlayer.delete({
      where: {
        playerId_followerId: { playerId, followerId: userId },
      },
      include,
    });
  }
}
