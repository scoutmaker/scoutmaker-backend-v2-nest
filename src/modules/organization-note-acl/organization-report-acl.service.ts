import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationNoteAceDto } from './dto/create-organization-note-ace.dto';
import { FindAllOrganizationNoteAceDto } from './dto/find-all-organization-note-ace.dto';
import { OrganizationNoteAcePaginationOptionsDto } from './dto/organization-note-ace-pagination-options.dto';
import { UpdateOrganizationNoteAceDto } from './dto/update-organization-note-ace.dto';

const include =
  Prisma.validator<Prisma.OrganizationNoteAccessControlEntryInclude>()({
    organization: true,
    note: true,
  });

@Injectable()
export class OrganizationNoteAclService {
  constructor(private readonly prisma: PrismaService) {}

  create(createAceDto: CreateOrganizationNoteAceDto) {
    return this.prisma.organizationNoteAccessControlEntry.create({
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
    }: OrganizationNoteAcePaginationOptionsDto,
    { noteId, organizationId }: FindAllOrganizationNoteAceDto,
  ) {
    let sort: Prisma.OrganizationNoteAccessControlEntryOrderByWithRelationInput;

    switch (sortBy) {
      case 'organization':
        sort = { organization: { name: sortingOrder } };
      case 'note':
        sort = { note: { createdAt: sortingOrder } };
        break;
      default:
        sort = { [sortBy]: sortingOrder };
        break;
    }

    const where: Prisma.OrganizationNoteAccessControlEntryWhereInput = {
      noteId,
      organizationId,
    };

    const accessControlEntries =
      await this.prisma.organizationNoteAccessControlEntry.findMany({
        where,
        take: limit,
        skip: calculateSkip(page, limit),
        orderBy: sort,
        include,
      });

    const total = await this.prisma.organizationNoteAccessControlEntry.count({
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
    return this.prisma.organizationNoteAccessControlEntry.findUnique({
      where: { id },
      include,
    });
  }

  update(id: string, updateAceDto: UpdateOrganizationNoteAceDto) {
    return this.prisma.organizationNoteAccessControlEntry.update({
      where: { id },
      data: updateAceDto,
      include,
    });
  }

  remove(id: string) {
    return this.prisma.organizationNoteAccessControlEntry.delete({
      where: { id },
      include,
    });
  }
}
