import { Injectable } from '@nestjs/common';
import { PaginationOptionsDto } from 'src/pagination/pagination-options.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';

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
