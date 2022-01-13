import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ClubsPaginationOptionsDto } from './dto/clubs-pagination-options.dto';
import { CreateClubDto } from './dto/create-club.dto';
import { FindAllClubsDto } from './dto/find-all-clubs.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { PrismaService } from '../prisma/prisma.service';
import { calculateSkip, formatPaginatedResponse } from '../utils/helpers';

const include: Prisma.ClubInclude = { region: { include: { country: true } } };

@Injectable()
export class ClubsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createClubDto: CreateClubDto, authorId: string) {
    const { regionId, ...rest } = createClubDto;
    return this.prisma.club.create({
      data: {
        ...rest,
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
        sort = { region: { country: { name: sortingOrder } } };
      default:
        sort = undefined;
        break;
    }

    const where: Prisma.ClubWhereInput = {
      name,
      regionId,
      region: { countryId },
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
    return `This action returns a #${id} club`;
  }

  update(id: string, updateClubDto: UpdateClubDto) {
    return `This action updates a #${id} club`;
  }

  remove(id: string) {
    return `This action removes a #${id} club`;
  }
}
