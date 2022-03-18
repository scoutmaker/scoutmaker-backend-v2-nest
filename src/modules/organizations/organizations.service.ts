import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { ToggleMembershipDto } from './dto/toggle-membership.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { getUserNamesString } from './helpers';

const include: Prisma.OrganizationInclude = { members: true };

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create({ name, memberIds }: CreateOrganizationDto) {
    const members = await this.prisma.user.findMany({
      where: { id: { in: memberIds } },
    });

    // 1. Check if members are valid (only regular scouts can be organization members)
    const notScoutUsers = members.filter((user) => user.role !== 'SCOUT');

    if (notScoutUsers.length !== 0) {
      throw new BadRequestException(
        `Only users with the role of SCOUT can be organization members. ${getUserNamesString(
          notScoutUsers,
        )} have a role different than SCOUT.`,
      );
    }

    // 2. Check if members are not already in an organization
    const alreadyInOrganizationUsers = members.filter(
      (user) => user.organizationId,
    );

    if (alreadyInOrganizationUsers.length !== 0) {
      throw new BadRequestException(
        `Users can be members of only one organization. ${getUserNamesString(
          alreadyInOrganizationUsers,
        )} are already members of other organizations.`,
      );
    }

    return this.prisma.organization.create({
      data: {
        name,
        members: { connect: memberIds.map((id) => ({ id })) },
      },
      include,
    });
  }

  findAll() {
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

  async addMember(id: string, { memberId }: ToggleMembershipDto) {
    const member = await this.prisma.user.findUnique({
      where: { id: memberId },
    });

    const name = `${member.firstName} ${member.lastName}`;

    // 1. Check if member is valid (only regular scouts can be members of an organization)
    if (member.role !== 'SCOUT') {
      throw new BadRequestException(
        `${name} has the role of ${member.role}. Only users with role of SCOUT can be members of an organization`,
      );
    }
    // 2. Check if member is not already in an organization
    if (member.organizationId) {
      throw new BadRequestException(
        `${name} is already member of another organization. Users can only be members of one organzation at once.`,
      );
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
