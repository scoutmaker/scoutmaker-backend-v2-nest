import { Injectable } from '@nestjs/common';
import { PaginationOptionsDto } from 'src/pagination/pagination-options.dto';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';

@Injectable()
export class ClubsService {
  create(createClubDto: CreateClubDto) {
    return 'This action adds a new club';
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
