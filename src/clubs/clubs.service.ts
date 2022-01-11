import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationOptionsDto } from 'src/pagination/pagination-options.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';

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

  findAll({}: PaginationOptionsDto, findAllDto: any) {
    return `This action returns all clubs`;
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
