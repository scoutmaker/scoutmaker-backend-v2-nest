import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

const include = Prisma.validator<Prisma.FollowAgencyInclude>()({
  agency: true,
  follower: true,
});

@Injectable()
export class FollowAgenciesService {
  constructor(private readonly prisma: PrismaService) {}

  create(agencyId: string, userId: string) {
    return this.prisma.followAgency.create({
      data: {
        agency: { connect: { id: agencyId } },
        follower: { connect: { id: userId } },
      },
      include,
    });
  }

  remove(agencyId: string, userId: string) {
    return this.prisma.followAgency.delete({
      where: {
        agencyId_followerId: { agencyId, followerId: userId },
      },
      include,
    });
  }
}
