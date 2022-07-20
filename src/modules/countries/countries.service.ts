import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CountriesPaginationOptionDto } from './dto/countries-pagination-options.dto';
import { CreateCountryDto } from './dto/create-country.dto';
import { FindAllCountriesDto } from './dto/find-all-countries.dto';
import { UpdateCountryDto } from './dto/update-country.dto';

@Injectable()
export class CountriesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCountryDto: CreateCountryDto) {
    return this.prisma.country.create({ data: createCountryDto });
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

  findOne(id: number) {
    return this.prisma.country.findUnique({
      where: { id },
    });
  }

  update(id: number, updateCountryDto: UpdateCountryDto) {
    return this.prisma.country.update({
      where: { id },
      data: updateCountryDto,
    });
  }

  remove(id: number) {
    return this.prisma.country.delete({ where: { id } });
  }
}
