import { Injectable } from '@nestjs/common';
import { Prisma, Season } from '@prisma/client';

import { parseCsv, validateInstances } from '../../utils/csv-helpers';
import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSeasonDto } from './dto/create-season.dto';
import { FindAllSeasonsDto } from './dto/find-all-seasons.dto';
import { SeasonsPaginationOptionsDto } from './dto/seasons-pagination-options.dto';
import { ToggleIsActiveDto } from './dto/toggle-is-active.dto';
import { UpdateSeasonDto } from './dto/update-season.dto';

interface CsvInput {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
}

@Injectable()
export class SeasonsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createSeasonDto: CreateSeasonDto) {
    const { endDate, startDate, ...rest } = createSeasonDto;

    return this.prisma.season.create({
      data: {
        ...rest,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });
  }

  async createManyFromCsv(file: Express.Multer.File) {
    const result = parseCsv<CsvInput>(file.buffer.toString());

    const instances = result.data.map((item) => {
      const instance = new CreateSeasonDto();
      instance.id = item.id?.toString();
      instance.name = item.name;
      instance.startDate = item.startDate;
      instance.endDate = item.endDate;

      return instance;
    });

    await validateInstances(instances);

    const createdDocuments: Season[] = [];
    const errors: any[] = [];

    for (const [index, instance] of instances.entries()) {
      try {
        const created = await this.create(instance);
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

  findOne(id: string) {
    return this.prisma.season.findUnique({ where: { id } });
  }

  update(id: string, updateSeasonDto: UpdateSeasonDto) {
    return this.prisma.season.update({ where: { id }, data: updateSeasonDto });
  }

  remove(id: string) {
    return this.prisma.season.delete({ where: { id } });
  }

  private disactivateAll() {
    return this.prisma.season.updateMany({ data: { isActive: null } });
  }

  async toggleIsActive(id: string, { isActive }: ToggleIsActiveDto) {
    if (isActive === true) {
      await this.disactivateAll();
    }

    const data: Prisma.SeasonUpdateInput = isActive
      ? { isActive }
      : { isActive: null };

    return this.prisma.season.update({ where: { id }, data });
  }
}
