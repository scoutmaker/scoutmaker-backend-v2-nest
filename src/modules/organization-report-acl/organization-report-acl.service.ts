import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationReportAceDto } from './dto/create-organization-report-ace.dto';
import { FindAllOrganizationReportAceDto } from './dto/find-all-organization-report-ace.dto';
import { OrganizationReportAcePaginationOptionsDto } from './dto/organization-report-ace-pagination-options.dto';
import { UpdateOrganizationReportAceDto } from './dto/update-organization-report-ace.dto';

const include =
  Prisma.validator<Prisma.OrganizationReportAccessControlEntryInclude>()({
    organization: true,
    report: true,
  });

@Injectable()
export class OrganizationReportAclService {
  constructor(private readonly prisma: PrismaService) {}

  create(createAceDto: CreateOrganizationReportAceDto) {
    return this.prisma.organizationReportAccessControlEntry.create({
      data: createAceDto,
      include,
    });
  }

  async findAll(
    {
      limit,
      page,
      sortBy,
      sortingOrder,
    }: OrganizationReportAcePaginationOptionsDto,
    { reportId, organizationId }: FindAllOrganizationReportAceDto,
  ) {
    let sort: Prisma.OrganizationReportAccessControlEntryOrderByWithRelationInput;

    switch (sortBy) {
      case 'organization':
        sort = { organization: { name: sortingOrder } };
      case 'report':
        sort = { report: { createdAt: sortingOrder } };
        break;
      default:
        sort = { [sortBy]: sortingOrder };
        break;
    }

    const where: Prisma.OrganizationReportAccessControlEntryWhereInput = {
      reportId,
      organizationId,
    };

    const accessControlEntries =
      await this.prisma.organizationReportAccessControlEntry.findMany({
        where,
        take: limit,
        skip: calculateSkip(page, limit),
        orderBy: sort,
        include,
      });

    const total = await this.prisma.organizationReportAccessControlEntry.count({
      where,
    });

    return formatPaginatedResponse({
      docs: accessControlEntries,
      totalDocs: total,
      limit,
      page,
    });
  }

  findOne(id: number) {
    return this.prisma.organizationReportAccessControlEntry.findUnique({
      where: { id },
      include,
    });
  }

  findOneByOrganizationAndReportId(organizationId: string, reportId: string) {
    return this.prisma.organizationReportAccessControlEntry.findUnique({
      where: {
        organizationId_reportId: { reportId, organizationId },
      },
    });
  }

  findOneByOrganizationAndPlayerId(organizationId: string, playerId: string) {
    return this.prisma.organizationReportAccessControlEntry.findFirst({
      where: {
        organization: { id: organizationId },
        report: { player: { id: playerId } },
      },
    });
  }

  update(id: number, updateAceDto: UpdateOrganizationReportAceDto) {
    return this.prisma.organizationReportAccessControlEntry.update({
      where: { id },
      data: updateAceDto,
      include,
    });
  }

  remove(id: number) {
    return this.prisma.organizationReportAccessControlEntry.delete({
      where: { id },
      include,
    });
  }
}
