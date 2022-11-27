import {
  BadRequestException,
  Injectable,
  ValidationError,
} from '@nestjs/common';
import { Prisma, Region } from '@prisma/client';
import { validate } from 'class-validator';
import { parse } from 'papaparse';

import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { FindAllRegionsDto } from './dto/find-all-regions.dto';
import { RegionsPaginationOptionsDto } from './dto/regions-pagination-options.dto';
import { UpdateRegionDto } from './dto/update-region.dto';

const include: Prisma.RegionInclude = { country: true };

interface CsvInput {
  id: number;
  name: string;
  countryId: number;
}

@Injectable()
export class RegionsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createRegionDto: CreateRegionDto) {
    return this.prisma.region.create({
      data: createRegionDto,
      include,
    });
  }

  async createManyFromCsv(file: Express.Multer.File) {
    const result = parse<CsvInput>(file.buffer.toString(), {
      header: true,
      dynamicTyping: true,
    });

    const instances = result.data.map((item) => {
      const instance = new CreateRegionDto();
      instance.id = item.id.toString();
      instance.name = item.name;
      instance.countryId = item.countryId.toString();

      return instance;
    });

    const totalValidationErrors: ValidationError[] = [];

    for (const instance of instances) {
      const errors = await validate(instance);
      if (errors.length > 0) {
        totalValidationErrors.push(...errors);
      }
    }

    if (totalValidationErrors.length !== 0) {
      throw new BadRequestException(totalValidationErrors, 'Bad CSV content');
    }

    const createdDocuments: Region[] = [];
    const errors: any[] = [];

    for (const [index, instance] of instances.entries()) {
      try {
        const created = await this.create(instance);
        createdDocuments.push(created);
      } catch (error) {
        errors.push({ index, name: instance.name, error });
      }
    }

    return { createdDocuments, errors };
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
