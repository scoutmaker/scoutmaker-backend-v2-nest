import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { FindAllRegionsDto } from './dto/find-all-regions.dto';
import { RegionsPaginationOptionsDto } from './dto/regions-pagination-options.dto';
import { UpdateRegionDto } from './dto/update-region.dto';

const include: Prisma.RegionInclude = { country: true };

@Injectable()
export class RegionsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createRegionDto: CreateRegionDto) {
    return this.prisma.region.create({
      data: createRegionDto,
      include,
    });
  }

  async findAll(
    { limit, page, sortBy, sortingOrder }: RegionsPaginationOptionsDto,
    { name, countryId }: FindAllRegionsDto,
  ) {
    let sort: Prisma.RegionOrderByWithRelationInput;

    switch (sortBy) {
      case 'name':
        sort = { name: sortingOrder };
        break;
      case 'countryId':
        sort = { country: { name: sortingOrder } };
      default:
        sort = undefined;
        break;
    }

    const where: Prisma.RegionWhereInput = {
      name: { contains: name, mode: 'insensitive' },
      countryId,
    };

    const regions = await this.prisma.region.findMany({
      where,
      take: limit,
      skip: calculateSkip(page, limit),
      orderBy: sort,
      include,
    });

    const total = await this.prisma.region.count({ where });

    return formatPaginatedResponse({
      docs: regions,
      totalDocs: total,
      limit,
      page,
    });
  }

  getList() {
    return this.prisma.region.findMany({ include });
  }

  findOne(id: string) {
    return this.prisma.region.findUnique({ where: { id }, include });
  }

  update(id: string, updateRegionDto: UpdateRegionDto) {
    return this.prisma.region.update({
      where: { id },
      data: updateRegionDto,
      include,
    });
  }

  remove(id: string) {
    return this.prisma.region.delete({ where: { id } });
  }
}
