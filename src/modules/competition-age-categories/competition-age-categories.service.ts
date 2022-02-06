import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompetitionAgeCategoryDto } from './dto/create-competition-age-category.dto';
import { UpdateCompetitionAgeCategoryDto } from './dto/update-competition-age-category.dto';

@Injectable()
export class CompetitionAgeCategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCompetitionAgeCategoryDto: CreateCompetitionAgeCategoryDto) {
    return this.prisma.competitionAgeCategory.create({
      data: createCompetitionAgeCategoryDto,
    });
  }

  findAll() {
    return this.prisma.competitionAgeCategory.findMany();
  }

  findOne(id: string) {
    return this.prisma.competitionAgeCategory.findUnique({ where: { id } });
  }

  update(
    id: string,
    updateCompetitionAgeCategoryDto: UpdateCompetitionAgeCategoryDto,
  ) {
    return this.prisma.competitionAgeCategory.update({
      where: { id },
      data: updateCompetitionAgeCategoryDto,
    });
  }

  remove(id: string) {
    return this.prisma.competitionAgeCategory.delete({ where: { id } });
  }
}
