import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreateSeasonDto } from './dto/create-season.dto';
import { ToggleIsActiveDto } from './dto/toggle-is-active.dto';
import { UpdateSeasonDto } from './dto/update-season.dto';

@Injectable()
export class SeasonsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createSeasonDto: CreateSeasonDto) {
    return this.prisma.season.create({ data: createSeasonDto });
  }

  findAll() {
    return this.prisma.season.findMany();
  }

  findOne(id: string) {
    return this.prisma.season.findUnique({ where: { id } });
  }

  update(id: string, updateSeasonDto: UpdateSeasonDto) {
    return this.prisma.season.update({ where: { id }, data: updateSeasonDto });
  }

  remove(id: string) {
    return this.prisma.season.delete({ where: { id } });
  }

  private disactivateAll() {
    return this.prisma.season.updateMany({ data: { isActive: null } });
  }

  async toggleIsActive(id: string, { isActive }: ToggleIsActiveDto) {
    if (isActive === true) {
      await this.disactivateAll();
    }

    const data: Prisma.SeasonUpdateInput = isActive
      ? { isActive }
      : { isActive: null };

    return this.prisma.season.update({ where: { id }, data });
  }
}
