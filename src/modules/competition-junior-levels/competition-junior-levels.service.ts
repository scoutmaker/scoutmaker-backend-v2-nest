import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateCompetitionJuniorLevelDto } from './dto/create-competition-junior-level.dto';
import { UpdateCompetitionJuniorLevelDto } from './dto/update-competition-junior-level.dto';

@Injectable()
export class CompetitionJuniorLevelsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCompetitionJuniorLevelDto: CreateCompetitionJuniorLevelDto) {
    return this.prisma.competitionJuniorLevel.create({
      data: createCompetitionJuniorLevelDto,
    });
  }

  findAll() {
    return this.prisma.competitionJuniorLevel.findMany();
  }

  findOne(id: number) {
    return this.prisma.competitionJuniorLevel.findUnique({ where: { id } });
  }

  update(
    id: number,
    updateCompetitionJuniorLevelDto: UpdateCompetitionJuniorLevelDto,
  ) {
    return this.prisma.competitionJuniorLevel.update({
      where: { id },
      data: updateCompetitionJuniorLevelDto,
    });
  }

  remove(id: number) {
    return this.prisma.competitionJuniorLevel.delete({ where: { id } });
  }
}
