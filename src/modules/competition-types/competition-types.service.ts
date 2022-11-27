import { Injectable } from '@nestjs/common';
import { CompetitionType, Prisma } from '@prisma/client';

import { parseCsv, validateInstances } from '../../utils/csv-helpers';
import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CompetitionTypesPaginationOptionsDto } from './dto/competition-types-pagination-options.dto';
import { CreateCompetitionTypeDto } from './dto/create-competition-type.dto';
import { FindAllCompetitionTypesDto } from './dto/find-all-competition-types.dto';
import { UpdateCompetitionTypeDto } from './dto/update-competition-type.dto';

interface CsvInput {
  id: number;
  name: string;
}

@Injectable()
export class CompetitionTypesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCompetitionTypeDto: CreateCompetitionTypeDto) {
    return this.prisma.competitionType.create({
      data: createCompetitionTypeDto,
    });
  }

  async createManyFromCsv(file: Express.Multer.File) {
    const result = parseCsv<CsvInput>(file.buffer.toString());

    const instances = result.data.map((item) => {
      const instance = new CreateCompetitionTypeDto();
      instance.id = item.id?.toString();
      instance.name = item.name;

      return instance;
    });

    await validateInstances(instances);

    const createdDocuments: CompetitionType[] = [];
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
    { limit, page, sortBy, sortingOrder }: CompetitionTypesPaginationOptionsDto,
    { name }: FindAllCompetitionTypesDto,
  ) {
    const where: Prisma.CompetitionTypeWhereInput = {
      name: { contains: name, mode: 'insensitive' },
    };

    const competitionTypes = await this.prisma.competitionType.findMany({
      where,
      take: limit,
      skip: calculateSkip(page, limit),
      orderBy: { [sortBy]: sortingOrder },
    });

    const total = await this.prisma.competitionType.count({ where });

    return formatPaginatedResponse({
      docs: competitionTypes,
      totalDocs: total,
      limit,
      page,
    });
  }

  getList() {
    return this.prisma.competitionType.findMany();
  }

  findOne(id: string) {
    return this.prisma.competitionType.findUnique({ where: { id } });
  }

  update(id: string, updateCompetitionTypeDto: UpdateCompetitionTypeDto) {
    return this.prisma.competitionType.update({
      where: { id },
      data: updateCompetitionTypeDto,
    });
  }

  remove(id: string) {
    return this.prisma.competitionType.delete({ where: { id } });
  }
}
