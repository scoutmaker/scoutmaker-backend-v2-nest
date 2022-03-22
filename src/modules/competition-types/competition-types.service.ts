import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateCompetitionTypeDto } from './dto/create-competition-type.dto';
import { UpdateCompetitionTypeDto } from './dto/update-competition-type.dto';

@Injectable()
export class CompetitionTypesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCompetitionTypeDto: CreateCompetitionTypeDto) {
    return this.prisma.competitionType.create({
      data: createCompetitionTypeDto,
    });
  }

  findAll() {
    return this.prisma.competitionType.findMany();
  }

  findOne(id: string) {
    return this.prisma.competitionType.findUnique({ where: { id } });
  }

  update(id: string, updateCompetitionTypeDto: UpdateCompetitionTypeDto) {
    return this.prisma.competitionType.update({
      where: { id },
      data: updateCompetitionTypeDto,
    });
  }

  remove(id: string) {
    return this.prisma.competitionType.delete({ where: { id } });
  }
}
