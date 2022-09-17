import { BadRequestException, Injectable } from '@nestjs/common';
import { Country, Prisma } from '@prisma/client';
import { validate, ValidationError } from 'class-validator';
import { parse } from 'papaparse';

import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CountriesPaginationOptionDto } from './dto/countries-pagination-options.dto';
import { CreateCountryDto } from './dto/create-country.dto';
import { FindAllCountriesDto } from './dto/find-all-countries.dto';
import { UpdateCountryDto } from './dto/update-country.dto';

interface CsvInput {
  id: number;
  name: string;
  code: string;
  isEuMember: boolean;
}

@Injectable()
export class CountriesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCountryDto: CreateCountryDto) {
    return this.prisma.country.create({ data: createCountryDto });
  }

  async createManyFromCsv(file: Express.Multer.File) {
    const result = parse<CsvInput>(file.buffer.toString(), {
      header: true,
      dynamicTyping: true,
    });

    const instances = result.data.map((item) => {
      const instance = new CreateCountryDto();
      instance.id = item.id.toString();
      instance.name = item.name;
      instance.code = item.code;
      instance.isEuMember = item.isEuMember;

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

    const createdDocuments: Country[] = [];
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
    { limit, page, sortBy, sortingOrder }: CountriesPaginationOptionDto,
    { isEuMember }: FindAllCountriesDto,
  ) {
    const where: Prisma.CountryWhereInput = { isEuMember };

    const countries = await this.prisma.country.findMany({
      where,
      take: limit,
      skip: calculateSkip(page, limit),
      orderBy: { [sortBy]: sortingOrder },
    });

    const total = await this.prisma.country.count({ where });

    return formatPaginatedResponse({
      docs: countries,
      totalDocs: total,
      limit,
      page,
    });
  }

  getList() {
    return this.prisma.country.findMany();
  }

  findOne(id: string) {
    return this.prisma.country.findUnique({
      where: { id },
    });
  }

  update(id: string, updateCountryDto: UpdateCountryDto) {
    return this.prisma.country.update({
      where: { id },
      data: updateCountryDto,
    });
  }

  remove(id: string) {
    return this.prisma.country.delete({ where: { id } });
  }
}
