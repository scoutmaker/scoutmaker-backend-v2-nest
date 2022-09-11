import { Injectable } from '@nestjs/common';
import { Agency, Prisma } from '@prisma/client';
import slugify from 'slugify';

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

  async create(createAgencyDto: CreateAgencyDto, authorId: string) {
    const { countryId, ...rest } = createAgencyDto;

    const slug = await this.generateSlug(rest.name);

    return this.prisma.agency.create({
      data: {
        ...rest,
        slug: slug,
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

  findOne(id: number) {
    return this.prisma.agency.findUnique({ where: { id }, include });
  }

  findAllBySlug(slug: string) {
    return this.prisma.agency.findMany({ where: { slug } });
  }

  async generateSlug(stringToSlugify: string) {
    const baseSlug = slugify(stringToSlugify, { lower: true });
    let i = 0;
    let agencies: Agency[];
    let slug = baseSlug;

    do {
      agencies = await this.findAllBySlug(slug);
      if (agencies.length !== 0) {
        i = i + 1;
        slug = `${baseSlug}-${i}`;
      }
    } while (agencies.length !== 0);

    return slug;
  }

  update(id: number, updateAgencyDto: UpdateAgencyDto) {
    return this.prisma.agency.update({
      where: { id },
      data: updateAgencyDto,
      include,
    });
  }

  remove(id: number) {
    return this.prisma.agency.delete({ where: { id }, include });
  }
}
