import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateCompetitionDto } from './dto/create-competition.dto';
import { FindAllCompetitionsDto } from './dto/find-all-competitions.dto';
import { UpdateCompetitionDto } from './dto/update-competition.dto';
import { PrismaService } from '../prisma/prisma.service';

const include: Prisma.CompetitionInclude = {
  country: true,
  ageCategory: true,
  type: true,
  juniorLevel: true,
};

@Injectable()
export class CompetitionsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCompetitionDto: CreateCompetitionDto) {
    const { countryId, ageCategoryId, typeId, juniorLevelId, ...rest } =
      createCompetitionDto;

    return this.prisma.competition.create({
      data: {
        ...rest,
        country: { connect: { id: countryId } },
        ageCategory: { connect: { id: ageCategoryId } },
        type: { connect: { id: typeId } },
        juniorLevel: juniorLevelId
          ? { connect: { id: juniorLevelId } }
          : undefined,
      },
      include,
    });
  }

  findAll({ countryId, regionId, isJunior, isWomen }: FindAllCompetitionsDto) {
    const where: Prisma.CompetitionWhereInput = {
      countryId,
    };

    return this.prisma.competition.findMany({ where, include });
  }

  findOne(id: string) {
    return this.prisma.competition.findUnique({ where: { id }, include });
  }

  async update(id: string, updateCompetitionDto: UpdateCompetitionDto) {
    const { countryId, ...rest } = updateCompetitionDto;

    // return this.prisma.competition.update({
    //   where: { id },
    //   data: {
    //     ...rest,
    //     country: countryId ? { connect: { id: countryId } } : undefined,
    //   },
    //   include,
    // });
  }

  async remove(id: string) {
    // Delete all region-on-competition entities for the given competition
    // await this.prisma.regionsOnCompetitions.deleteMany({
    //   where: { competitionId: id },
    // });
    // Delete an actual competition
    return this.prisma.competition.delete({ where: { id }, include });
  }
}
