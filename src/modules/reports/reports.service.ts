import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

const include: Prisma.ReportInclude = {
  template: true,
  player: {
    include: {
      country: true,
      primaryPosition: true,
      teams: { include: { team: true } },
    },
  },
  positionPlayed: true,
  match: { include: { homeTeam: true, awayTeam: true } },
  author: true,
  skills: { include: { template: { include: { category: true } } } },
};

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createReportDto: CreateReportDto, authorId: string) {
    const {
      templateId,
      playerId,
      matchId,
      positionPlayedId,
      skillAssessments,
      ...rest
    } = createReportDto;

    // TODO: calculate percentage rating

    // TODO: calculate avarage rating

    return this.prisma.report.create({
      data: {
        ...rest,
        template: { connect: { id: templateId } },
        player: { connect: { id: playerId } },
        positionPlayed: positionPlayedId
          ? { connect: { id: positionPlayedId } }
          : undefined,
        match: matchId ? { connect: { id: matchId } } : undefined,
        author: { connect: { id: authorId } },
        skills:
          skillAssessments && skillAssessments.length > 0
            ? {
                createMany: {
                  data: skillAssessments.map(
                    ({ templateId, description, rating }) => ({
                      templateId,
                      description,
                      rating,
                    }),
                  ),
                },
              }
            : undefined,
      },
      include,
    });
  }

  findAll() {
    return `This action returns all reports`;
  }

  findOne(id) {
    return this.prisma.report.findUnique({ where: { id }, include });
  }

  update(id, updateReportDto: UpdateReportDto) {
    return `This action updates a #${id} report`;
  }

  remove(id) {
    return `This action removes a #${id} report`;
  }
}
