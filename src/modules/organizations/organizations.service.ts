import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { ToggleMembershipDto } from './dto/toggle-membership.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

const include: Prisma.OrganizationInclude = { members: true };

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  create({ name, memberIds }: CreateOrganizationDto) {
    // 1. Check if members are valid (only regular scouts can be organization members)
    // 2. Check if members are not already in an organization

    return 'This action adds a new organization';
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

  addMember(id: string, { memberId }: ToggleMembershipDto) {
    return `This action adds a member to a #${id} organization`;
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
