import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { AgenciesPaginationOptions } from './dto/agencies-pagination-options.dto';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { FindAllAgenciesDto } from './dto/find-all-agencies.dto';
import { UpdateAgencyDto } from './dto/update-agency.dto';

const include: Prisma.AgencyInclude = { country: true };
@Injectable()
export class AgenciesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createAgencyDto: CreateAgencyDto, authorId: string) {
    const { countryId, ...rest } = createAgencyDto;

    return this.prisma.agency.create({
      data: {
        ...rest,
        country: { connect: { id: countryId } },
        author: { connect: { id: authorId } },
      },
      include,
    });
  }

  async findAll(
    { limit, page, sortBy, sortingOrder }: AgenciesPaginationOptions,
    { countryId, name }: FindAllAgenciesDto,
  ) {
    let sort: Prisma.AgencyOrderByWithRelationInput;

    switch (sortBy) {
      case 'country':
        sort = { country: { name: sortingOrder } };
        break;
      default:
        sort = { [sortBy]: sortingOrder };
    }

    const where: Prisma.AgencyWhereInput = {
      name: { contains: name, mode: 'insensitive' },
      countryId,
    };

    const agencies = await this.prisma.agency.findMany({
      where,
      take: limit,
      skip: calculateSkip(page, limit),
      orderBy: sort,
      include,
    });

    const total = await this.prisma.agency.count({ where });

    return formatPaginatedResponse({
      docs: agencies,
      totalDocs: total,
      limit,
      page,
    });
  }

  getList() {
    return this.prisma.agency.findMany();
  }

  findOne(id: string) {
    return this.prisma.agency.findUnique({ where: { id }, include });
  }

  update(id: string, updateAgencyDto: UpdateAgencyDto) {
    return this.prisma.agency.update({
      where: { id },
      data: updateAgencyDto,
      include,
    });
  }

  remove(id: string) {
    return this.prisma.agency.delete({ where: { id }, include });
  }
}
