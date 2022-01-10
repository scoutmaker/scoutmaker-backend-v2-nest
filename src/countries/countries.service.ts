import { Injectable } from '@nestjs/common';
import { PaginationOptionsDto } from 'src/pagination/pagination-options.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  formatPaginatedResponse,
  transformPaginationOptions,
} from '../utils/helpers';
import { CreateCountryDto } from './dto/create-country.dto';
import { FindAllDto } from './dto/find-all.dto';
import { UpdateCountryDto } from './dto/update-country.dto';

@Injectable()
export class CountriesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCountryDto: CreateCountryDto) {
    return this.prisma.country.create({ data: createCountryDto });
  }

  async findAll(
    { limit, page, sortBy, sortingOrder }: PaginationOptionsDto,
    { isEuMember }: FindAllDto,
  ) {
    const countries = await this.prisma.country.findMany({
      where: {
        isEuMember,
      },
      ...transformPaginationOptions({ limit, page, sortBy, sortingOrder }),
    });

    const total = await this.prisma.country.count();

    return formatPaginatedResponse({
      docs: countries,
      totalDocs: total,
      limit,
      page,
    });
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
