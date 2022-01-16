import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompetitionDto } from './dto/create-competition.dto';
import { UpdateCompetitionDto } from './dto/update-competition.dto';

const include: Prisma.CompetitionInclude = {
  country: true,
  regions: { include: { region: true } },
};

@Injectable()
export class CompetitionsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCompetitionDto: CreateCompetitionDto) {
    const { regionsIds, countryId, ...rest } = createCompetitionDto;

    return this.prisma.competition.create({
      data: {
        ...rest,
        country: { connect: { id: countryId } },
        regions: {
          createMany: {
            data: regionsIds.map((regionId) => ({ regionId })),
          },
        },
      },
      include,
    });
  }

  findAll() {
    return this.prisma.competition.findMany({ include });
  }

  findOne(id: number) {
    return `This action returns a #${id} competition`;
  }

  update(id: number, updateCompetitionDto: UpdateCompetitionDto) {
    return `This action updates a #${id} competition`;
  }

  remove(id: number) {
    return `This action removes a #${id} competition`;
  }
}
