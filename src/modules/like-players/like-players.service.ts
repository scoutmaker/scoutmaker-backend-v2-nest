import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

const include = Prisma.validator<Prisma.LikePlayerInclude>()({
  player: true,
  user: true,
});

@Injectable()
export class LikePlayersService {
  constructor(private readonly prisma: PrismaService) {}

  like(playerId: number, userId: number) {
    return this.prisma.likePlayer.create({
      data: {
        player: { connect: { id: playerId } },
        user: { connect: { id: userId } },
      },
      include,
    });
  }

  unlike(playerId: number, userId: number) {
    return this.prisma.likePlayer.delete({
      where: {
        playerId_userId: { playerId, userId },
      },
      include,
    });
  }
}
