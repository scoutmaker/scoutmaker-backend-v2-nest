import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { I18nService } from 'nestjs-i18n';

import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { FindAllOrganizationsDto } from './dto/find-all-organizations.dto';
import { OrganizationsPaginationOptionsDto } from './dto/organizations-pagination-options.dto';
import { ToggleMembershipDto } from './dto/toggle-membership.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { getUserNamesString } from './helpers';

const include = Prisma.validator<Prisma.OrganizationInclude>()({
  members: true,
});

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async create({ name, memberIds }: CreateOrganizationDto, lang: string) {
    const members = await this.prisma.user.findMany({
      where: { id: { in: memberIds } },
    });

    // 1. Check if members are valid (only regular scouts can be organization members)
    const notScoutUsers = members.filter((user) => user.role !== 'SCOUT');

    if (notScoutUsers.length !== 0) {
      const message = this.i18n.translate(
        'organizations.CREATE_MEMBERS_ROLE_ERROR',
        { lang, args: { userNames: getUserNamesString(notScoutUsers) } },
      );
      throw new BadRequestException(message);
    }

    // 2. Check if members are not already in an organization
    const alreadyInOrganizationUsers = members.filter(
      (user) => user.organizationId,
    );

    if (alreadyInOrganizationUsers.length !== 0) {
      const message = this.i18n.translate(
        'organizations.CREATE_MEMBER_ALREADY_IN_ORG_ERROR',
        {
          lang,
          args: { userNames: getUserNamesString(alreadyInOrganizationUsers) },
        },
      );
      throw new BadRequestException(message);
    }

    return this.prisma.organization.create({
      data: {
        name,
        members: { connect: memberIds.map((id) => ({ id })) },
      },
      include,
    });
  }

  async findAll(
    { limit, page, sortBy, sortingOrder }: OrganizationsPaginationOptionsDto,
    { name }: FindAllOrganizationsDto,
  ) {
    const where: Prisma.OrganizationWhereInput = {
      name: { contains: name, mode: 'insensitive' },
    };

    const organizations = await this.prisma.organization.findMany({
      where,
      take: limit,
      skip: calculateSkip(page, limit),
      orderBy: { [sortBy]: sortingOrder },
      include,
    });

    const total = await this.prisma.organization.count({ where });

    return formatPaginatedResponse({
      docs: organizations,
      totalDocs: total,
      limit,
      page,
    });
  }

  getList() {
    return this.prisma.organization.findMany({ include });
  }

  findOne(id: string) {
    return this.prisma.organization.findUnique({ where: { id }, include });
  }

  update(id: string, updateOrganizationDto: UpdateOrganizationDto) {
    return this.prisma.organization.update({
      where: { id },
      data: updateOrganizationDto,
      include,
    });
  }

  async addMember(id: string, { memberId }: ToggleMembershipDto, lang: string) {
    const member = await this.prisma.user.findUnique({
      where: { id: memberId },
    });

    const name = `${member.firstName} ${member.lastName}`;

    // 1. Check if member is valid (only regular scouts can be members of an organization)
    if (member.role !== 'SCOUT') {
      const message = this.i18n.translate(
        'organizations.ADD_MEMBER_ROLE_ERROR',
        { lang, args: { userName: name, role: member.role } },
      );
      throw new BadRequestException(message);
    }
    // 2. Check if member is not already in an organization
    if (member.organizationId) {
      const message = this.i18n.translate(
        'organizations.ADD_MEMBER_ALREADY_IN_ORG_ERROR',
        { lang, args: { userName: name } },
      );
      throw new BadRequestException(message);
    }

    return this.prisma.organization.update({
      where: { id },
      data: { members: { connect: { id: memberId } } },
      include,
    });
  }

  removeMember(id: string, { memberId }: ToggleMembershipDto) {
    return this.prisma.organization.update({
      where: { id },
      data: { members: { disconnect: { id: memberId } } },
      include,
    });
  }

  remove(id: string) {
    return this.prisma.organization.delete({ where: { id }, include });
  }
}
