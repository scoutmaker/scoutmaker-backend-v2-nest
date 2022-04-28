import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

const include = Prisma.validator<Prisma.LikeReportInclude>()({
  report: true,
  user: true,
});

@Injectable()
export class LikeReportsService {
  constructor(private readonly prisma: PrismaService) {}

  like(reportId: string, userId: string) {
    return this.prisma.likeReport.create({
      data: {
        report: { connect: { id: reportId } },
        user: { connect: { id: userId } },
      },
      include,
    });
  }

  unlike(reportId: string, userId: string) {
    return this.prisma.likeReport.delete({
      where: {
        reportId_userId: { reportId, userId },
      },
      include,
    });
  }
}
