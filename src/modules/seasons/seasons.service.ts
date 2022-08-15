import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSeasonDto } from './dto/create-season.dto';
import { FindAllSeasonsDto } from './dto/find-all-seasons.dto';
import { SeasonsPaginationOptionsDto } from './dto/seasons-pagination-options.dto';
import { ToggleIsActiveDto } from './dto/toggle-is-active.dto';
import { UpdateSeasonDto } from './dto/update-season.dto';

@Injectable()
export class SeasonsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createSeasonDto: CreateSeasonDto) {
    return this.prisma.season.create({ data: createSeasonDto });
  }

  async findAll(
    { limit, page, sortBy, sortingOrder }: SeasonsPaginationOptionsDto,
    { name }: FindAllSeasonsDto,
  ) {
    const where: Prisma.SeasonWhereInput = {
      name: { contains: name, mode: 'insensitive' },
    };

    const seasons = await this.prisma.season.findMany({
      where,
      take: limit,
      skip: calculateSkip(page, limit),
      orderBy: { [sortBy]: sortingOrder },
    });

    const total = await this.prisma.season.count({ where });

    return formatPaginatedResponse({
      docs: seasons,
      totalDocs: total,
      limit,
      page,
    });
  }

  getList() {
    return this.prisma.season.findMany();
  }

  findOne(id: number) {
    return this.prisma.season.findUnique({ where: { id } });
  }

  update(id: number, updateSeasonDto: UpdateSeasonDto) {
    return this.prisma.season.update({ where: { id }, data: updateSeasonDto });
  }

  remove(id: number) {
    return this.prisma.season.delete({ where: { id } });
  }

  private disactivateAll() {
    return this.prisma.season.updateMany({ data: { isActive: null } });
  }

  async toggleIsActive(id: number, { isActive }: ToggleIsActiveDto) {
    if (isActive === true) {
      await this.disactivateAll();
    }

    const data: Prisma.SeasonUpdateInput = isActive
      ? { isActive }
      : { isActive: null };

    return this.prisma.season.update({ where: { id }, data });
  }
}
