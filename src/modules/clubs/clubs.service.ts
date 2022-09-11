import { Injectable } from '@nestjs/common';
import { Club, Prisma } from '@prisma/client';
import slugify from 'slugify';

import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { ClubsPaginationOptionsDto } from './dto/clubs-pagination-options.dto';
import { CreateClubDto } from './dto/create-club.dto';
import { FindAllClubsDto } from './dto/find-all-clubs.dto';
import { UpdateClubDto } from './dto/update-club.dto';

const include: Prisma.ClubInclude = {
  region: true,
  country: true,
};

@Injectable()
export class ClubsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createClubDto: CreateClubDto, authorId: string) {
    const { regionId, countryId, ...rest } = createClubDto;

    const slug = await this.generateSlug(rest.name);

    return this.prisma.club.create({
      data: {
        ...rest,
        slug,
        country: { connect: { id: countryId } },
        region: { connect: { id: regionId } },
        author: { connect: { id: authorId } },
      },
      include,
    });
  }

  async findAll(
    { limit, page, sortBy, sortingOrder }: ClubsPaginationOptionsDto,
    { name, regionId, countryId }: FindAllClubsDto,
  ) {
    let sort: Prisma.ClubOrderByWithRelationInput;

    switch (sortBy) {
      case 'name':
        sort = { name: sortingOrder };
        break;
      case 'regionId':
        sort = { region: { name: sortingOrder } };
      case 'countryId':
        sort = { country: { name: sortingOrder } };
      default:
        sort = undefined;
        break;
    }

    const where: Prisma.ClubWhereInput = {
      name,
      regionId,
      countryId,
    };

    const clubs = await this.prisma.club.findMany({
      where,
      take: limit,
      skip: calculateSkip(page, limit),
      orderBy: sort,
      include,
    });

    const total = await this.prisma.club.count({ where });

    return formatPaginatedResponse({
      docs: clubs,
      totalDocs: total,
      limit,
      page,
    });
  }

  getList() {
    return this.prisma.club.findMany();
  }

  findOne(id: string) {
    return this.prisma.club.findUnique({ where: { id }, include });
  }

  findOneBySlug(slug: string) {
    return this.prisma.club.findUnique({ where: { slug }, include });
  }

  findAllBySlug(slug: string) {
    return this.prisma.club.findMany({ where: { slug } });
  }

  async generateSlug(stringToSlugify: string) {
    const baseSlug = slugify(stringToSlugify, { lower: true });
    let i = 0;
    let clubs: Club[];
    let slug = baseSlug;

    do {
      clubs = await this.findAllBySlug(slug);
      if (clubs.length !== 0) {
        i = i + 1;
        slug = `${baseSlug}-${i}`;
      }
    } while (clubs.length !== 0);

    return slug;
  }

  update(id: string, updateClubDto: UpdateClubDto) {
    return this.prisma.club.update({
      where: { id },
      data: updateClubDto,
      include,
    });
  }

  remove(id: string) {
    return this.prisma.club.delete({ where: { id }, include });
  }
}
