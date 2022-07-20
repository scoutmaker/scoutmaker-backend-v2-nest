import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationPlayerAceDto } from './dto/create-organization-player-ace.dto';
import { FindAllOrganizationPlayerAceDto } from './dto/find-all-organization-player-ace.dto';
import { OrganizationPlayerAcePaginationOptionsDto } from './dto/organization-player-ace-pagination-options.dto';
import { UpdateOrganizationPlayerAceDto } from './dto/update-organization-player-ace.dto';

const include =
  Prisma.validator<Prisma.OrganizationPlayerAccessControlEntryInclude>()({
    organization: true,
    player: true,
  });

@Injectable()
export class OrganizationPlayerAclService {
  constructor(private readonly prisma: PrismaService) {}

  create(createAceDto: CreateOrganizationPlayerAceDto) {
    return this.prisma.organizationPlayerAccessControlEntry.create({
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
    }: OrganizationPlayerAcePaginationOptionsDto,
    { playerId, organizationId }: FindAllOrganizationPlayerAceDto,
  ) {
    let sort: Prisma.OrganizationPlayerAccessControlEntryOrderByWithRelationInput;

    switch (sortBy) {
      case 'organization':
        sort = { organization: { name: sortingOrder } };
      case 'player':
        sort = { player: { lastName: sortingOrder } };
        break;
      default:
        sort = { [sortBy]: sortingOrder };
        break;
    }

    const where: Prisma.OrganizationPlayerAccessControlEntryWhereInput = {
      playerId,
      organizationId,
    };

    const accessControlEntries =
      await this.prisma.organizationPlayerAccessControlEntry.findMany({
        where,
        take: limit,
        skip: calculateSkip(page, limit),
        orderBy: sort,
        include,
      });

    const total = await this.prisma.userPlayerAccessControlEntry.count({
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
    return this.prisma.organizationPlayerAccessControlEntry.findUnique({
      where: { id },
      include,
    });
  }

  findOneByOrganizationAndPlayerId(organizationId: number, playerId: number) {
    return this.prisma.organizationPlayerAccessControlEntry.findUnique({
      where: {
        organizationId_playerId: { organizationId, playerId },
      },
    });
  }

  update(id: number, updateAceDto: UpdateOrganizationPlayerAceDto) {
    return this.prisma.organizationPlayerAccessControlEntry.update({
      where: { id },
      data: updateAceDto,
      include,
    });
  }

  remove(id: number) {
    return this.prisma.organizationPlayerAccessControlEntry.delete({
      where: { id },
      include,
    });
  }
}
