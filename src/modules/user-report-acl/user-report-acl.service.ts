import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserReportAceDto } from './dto/create-user-report-ace.dto';
import { FindAllUserReportAceDto } from './dto/find-all-user-report-ace.dto';
import { UpdateUserReportAceDto } from './dto/update-user-report-ace.dto';
import { UserReportAcePaginationOptionsDto } from './dto/user-report-ace-pagination-options.dto';

const include = Prisma.validator<Prisma.UserReportAccessControlEntryInclude>()({
  user: true,
  report: true,
});

@Injectable()
export class UserReportAclService {
  constructor(private readonly prisma: PrismaService) {}

  create(createAceDto: CreateUserReportAceDto) {
    return this.prisma.userReportAccessControlEntry.create({
      data: createAceDto,
      include,
    });
  }

  async findAll(
    { limit, page, sortBy, sortingOrder }: UserReportAcePaginationOptionsDto,
    { reportId, userId }: FindAllUserReportAceDto,
  ) {
    let sort: Prisma.UserReportAccessControlEntryOrderByWithRelationInput;

    switch (sortBy) {
      case 'user':
        sort = { user: { lastName: sortingOrder } };
        break;
      case 'report':
        sort = { report: { createdAt: sortingOrder } };
        break;
      default:
        sort = { [sortBy]: sortingOrder };
        break;
    }

    const where: Prisma.UserReportAccessControlEntryWhereInput = {
      reportId,
      userId,
    };

    const accessControlEntries =
      await this.prisma.userReportAccessControlEntry.findMany({
        where,
        take: limit,
        skip: calculateSkip(page, limit),
        orderBy: sort,
        include,
      });

    const total = await this.prisma.userReportAccessControlEntry.count({
      where,
    });

    return formatPaginatedResponse({
      docs: accessControlEntries,
      totalDocs: total,
      limit,
      page,
    });
  }

  findOne(id: string) {
    return this.prisma.userReportAccessControlEntry.findUnique({
      where: { id },
      include,
    });
  }

  findOneByUserAndReportId(userId: string, reportId: string) {
    return this.prisma.userReportAccessControlEntry.findUnique({
      where: { userId_reportId: { userId, reportId } },
    });
  }

  findOneByUserAndPlayerId(userId: string, playerId: string) {
    return this.prisma.userReportAccessControlEntry.findFirst({
      where: {
        user: { id: userId },
        report: { player: { id: playerId } },
      },
    });
  }

  update(id: string, updateAceDto: UpdateUserReportAceDto) {
    return this.prisma.userReportAccessControlEntry.update({
      where: { id },
      data: updateAceDto,
      include,
    });
  }

  remove(id: string) {
    return this.prisma.userReportAccessControlEntry.delete({
      where: { id },
      include,
    });
  }
}
