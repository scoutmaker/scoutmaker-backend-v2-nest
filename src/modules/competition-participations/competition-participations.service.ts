import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompetitionParticipationDto } from './dto/create-competition-participation.dto';
import { FindUniqueCompetitionParticipationDto } from './dto/find-unique-competition-participation.dto';
import { UpdateCompetitionParticipationDto } from './dto/update-competition-participation.dto';

const include: Prisma.CompetitionParticipationInclude = {
  team: true,
  competition: true,
  group: true,
  season: true,
};
@Injectable()
export class CompetitionParticipationsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCompetitionParticipationDto: CreateCompetitionParticipationDto) {
    return this.prisma.competitionParticipation.create({
      data: createCompetitionParticipationDto,
      include,
    });
  }

  findAll() {
    return this.prisma.competitionParticipation.findMany({ include });
  }

  findOne(findUniqueDto: FindUniqueCompetitionParticipationDto) {
    return this.prisma.competitionParticipation.findUnique({
      where: { teamId_competitionId_seasonId: { ...findUniqueDto } },
      include,
    });
  }

  update(
    findUniqueDto: FindUniqueCompetitionParticipationDto,
    updateCompetitionParticipationDto: UpdateCompetitionParticipationDto,
  ) {
    return this.prisma.competitionParticipation.update({
      where: { teamId_competitionId_seasonId: { ...findUniqueDto } },
      data: updateCompetitionParticipationDto,
      include,
    });
  }

  remove(findUniqueDto: FindUniqueCompetitionParticipationDto) {
    return this.prisma.competitionParticipation.delete({
      where: { teamId_competitionId_seasonId: { ...findUniqueDto } },
      include,
    });
  }

  async copyFromSeasonToSeason(fromSeasonId: string, toSeasonId: string) {
    if (fromSeasonId === toSeasonId) {
      throw new BadRequestException(
        'Cannot copy participations to the same season',
      );
    }

    const participations = await this.prisma.competitionParticipation.findMany({
      where: { seasonId: fromSeasonId },
    });
    const participationsToCreate = participations.map((participation) => ({
      ...participation,
      seasonId: toSeasonId,
    }));
    return this.prisma.competitionParticipation.createMany({
      data: participationsToCreate,
    });
  }
}
