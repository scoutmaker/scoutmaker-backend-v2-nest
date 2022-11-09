import { Injectable } from '@nestjs/common';
import { ObservationType, Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

const include = Prisma.validator<Prisma.MatchAttendanceInclude>()({
  match: { include: { homeTeam: true, awayTeam: true, competition: true } },
  user: true,
});

@Injectable()
export class MatchAttendancesService {
  constructor(private readonly prisma: PrismaService) {}

  findOne(matchId: string, userId: string) {
    return this.prisma.matchAttendance.findUnique({
      where: { matchId_userId: { matchId, userId } },
      include,
    });
  }

  async goToMatch(
    matchId: string,
    userId: string,
    observationType: ObservationType,
  ) {
    const activeAttendance = await this.findActiveByUserId(userId);

    // Set current active attendance isActive flag to null
    if (activeAttendance) {
      await this.prisma.matchAttendance.update({
        where: { userId_isActive: { userId, isActive: true } },
        data: { isActive: null },
      });
    }

    const attendance = await this.findOne(matchId, userId);

    // If the user is already attending the match, set the attendance isActive flag to true
    if (attendance) {
      return this.prisma.matchAttendance.update({
        where: { matchId_userId: { matchId, userId } },
        data: { isActive: true, observationType },
        include,
      });
    }

    // If there is no attendance, create a new attendance
    return this.prisma.matchAttendance.create({
      data: {
        match: { connect: { id: matchId } },
        user: { connect: { id: userId } },
        isActive: true,
        observationType,
      },
      include,
    });
  }

  leaveTheMatch(matchId: string, userId: string) {
    return this.prisma.matchAttendance.update({
      where: { matchId_userId: { matchId, userId } },
      data: { isActive: null },
      include,
    });
  }

  findActiveByUserId(userId: string) {
    return this.prisma.matchAttendance.findUnique({
      where: { userId_isActive: { userId, isActive: true } },
      include,
    });
  }
}
