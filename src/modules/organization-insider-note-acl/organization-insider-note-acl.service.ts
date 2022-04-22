import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationInsiderNoteAceDto } from './dto/create-organization-insider-note-ace.dto';
import { FindAllOrganizationInsiderNoteAceDto } from './dto/find-all-organization-insider-note-ace.dto';
import { OrganizationInsiderNoteAcePaginationOptionsDto } from './dto/organization-insider-note-ace-pagination-options.dto';
import { UpdateOrganizationInsiderNoteAceDto } from './dto/update-organization-insider-note-ace.dto';

const include =
  Prisma.validator<Prisma.OrganizationInsiderNoteAccessControlEntryInclude>()({
    organization: true,
    insiderNote: true,
  });

@Injectable()
export class OrganizationInsiderNoteAclService {
  constructor(private readonly prisma: PrismaService) {}

  create(createAceDto: CreateOrganizationInsiderNoteAceDto) {
    return this.prisma.organizationInsiderNoteAccessControlEntry.create({
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
    }: OrganizationInsiderNoteAcePaginationOptionsDto,
    { insiderNoteId, organizationId }: FindAllOrganizationInsiderNoteAceDto,
  ) {
    let sort: Prisma.OrganizationInsiderNoteAccessControlEntryOrderByWithRelationInput;

    switch (sortBy) {
      case 'organization':
        sort = { organization: { name: sortingOrder } };
      case 'insiderNote':
        sort = { insiderNote: { createdAt: sortingOrder } };
        break;
      default:
        sort = { [sortBy]: sortingOrder };
        break;
    }

    const where: Prisma.OrganizationInsiderNoteAccessControlEntryWhereInput = {
      insiderNoteId,
      organizationId,
    };

    const accessControlEntries =
      await this.prisma.organizationInsiderNoteAccessControlEntry.findMany({
        where,
        take: limit,
        skip: calculateSkip(page, limit),
        orderBy: sort,
        include,
      });

    const total =
      await this.prisma.organizationInsiderNoteAccessControlEntry.count({
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
    return this.prisma.organizationInsiderNoteAccessControlEntry.findUnique({
      where: { id },
      include,
    });
  }

  findOneByOrganizationAndInsiderNoteId(
    organizationId: string,
    insiderNoteId: string,
  ) {
    return this.prisma.organizationInsiderNoteAccessControlEntry.findUnique({
      where: {
        organizationId_insiderNoteId: { insiderNoteId, organizationId },
      },
    });
  }

  findOneByOrganizationAndPlayerId(organizationId: string, playerId: string) {
    return this.prisma.organizationInsiderNoteAccessControlEntry.findFirst({
      where: {
        organization: { id: organizationId },
        insiderNote: { player: { id: playerId } },
      },
    });
  }

  update(id: string, updateAceDto: UpdateOrganizationInsiderNoteAceDto) {
    return this.prisma.organizationInsiderNoteAccessControlEntry.update({
      where: { id },
      data: updateAceDto,
      include,
    });
  }

  remove(id: string) {
    return this.prisma.organizationInsiderNoteAccessControlEntry.delete({
      where: { id },
      include,
    });
  }
}
