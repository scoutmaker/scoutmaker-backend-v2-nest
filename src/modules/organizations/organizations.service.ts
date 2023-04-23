import { BadRequestException, Injectable } from '@nestjs/common';
import { Organization, Prisma } from '@prisma/client';
import { I18nService } from 'nestjs-i18n';

import { parseCsv, validateInstances } from '../../utils/csv-helpers';
import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { FindAllOrganizationsDto } from './dto/find-all-organizations.dto';
import { OrganizationsPaginationOptionsDto } from './dto/organizations-pagination-options.dto';
import { ToggleMembershipDto } from './dto/toggle-membership.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { getUserNamesString } from './helpers';

interface CsvInput {
  id: number;
  name: string;
  memberIds: string;
}

const include = Prisma.validator<Prisma.OrganizationInclude>()({
  members: true,
});

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async create(
    { name, memberIds, logoUrl }: CreateOrganizationDto,
    lang: string,
  ) {
    const members = await this.prisma.user.findMany({
      where: { id: { in: memberIds } },
    });

    // Check if members are not already in an organization
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
        logoUrl,
        members: { connect: memberIds.map((id) => ({ id })) },
      },
      include,
    });
  }

  async createManyFromCsv(file: Express.Multer.File, lang: string) {
    const result = parseCsv<CsvInput>(file.buffer.toString());

    const instances = result.data.map((item) => {
      const instance = new CreateOrganizationDto();

      instance.id = item.id?.toString();
      instance.name = item.name;
      instance.memberIds = item.memberIds.toString().split(',');

      return instance;
    });

    await validateInstances(instances);

    const createdDocuments: Organization[] = [];
    const errors: any[] = [];

    for (const [index, instance] of instances.entries()) {
      try {
        const created = await this.create(instance, lang);
        createdDocuments.push(created);
      } catch (error) {
        errors.push({ index, name: instance.name, error });
      }
    }

    return {
      csvRowsCount: result.data.length,
      createdCount: createdDocuments.length,
      errors,
    };
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

  getList(
    filters?: Prisma.OrganizationWhereInput,
    additionalInclude?: Prisma.OrganizationInclude,
  ) {
    return this.prisma.organization.findMany({
      include: additionalInclude
        ? { ...include, ...additionalInclude }
        : include,
      where: filters,
    });
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

    // Check if member is not already in an organization
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
