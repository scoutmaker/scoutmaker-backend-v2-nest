import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { I18nService } from 'nestjs-i18n';

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
  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
  ) {}

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

  async copyFromSeasonToSeason(
    fromSeasonId: string,
    toSeasonId: string,
    lang: string,
  ) {
    if (fromSeasonId === toSeasonId) {
      const message = await this.i18n.translate(
        'competition-participations.COPY_SAME_SEASON_ERROR',
        { lang },
      );
      throw new BadRequestException(message);
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
