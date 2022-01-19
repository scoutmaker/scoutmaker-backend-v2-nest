import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ClubsPaginationOptionsDto } from './dto/clubs-pagination-options.dto';
import { CreateClubDto } from './dto/create-club.dto';
import { FindAllClubsDto } from './dto/find-all-clubs.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { PrismaService } from '../prisma/prisma.service';
import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';

const include: Prisma.ClubInclude = {
  region: true,
  country: true,
};

@Injectable()
export class ClubsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createClubDto: CreateClubDto, authorId: string) {
    const { regionId, countryId, ...rest } = createClubDto;
    return this.prisma.club.create({
      data: {
        ...rest,
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

  findOne(id: string) {
    return this.prisma.club.findUnique({ where: { id }, include });
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
