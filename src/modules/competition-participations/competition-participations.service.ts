import { BadRequestException, Injectable } from '@nestjs/common';
import { CompetitionParticipation, Prisma } from '@prisma/client';
import { I18nService } from 'nestjs-i18n';

import { parseCsv, validateInstances } from '../../utils/csv-helpers';
import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CompetitionParticipationsPaginationOptionsDto } from './dto/competition-participations-pagination-options.dto';
import { CreateCompetitionParticipationDto } from './dto/create-competition-participation.dto';
import { FindAllCompetitionParticipationsDto } from './dto/find-all-competition-participations.dto';
import { UpdateCompetitionParticipationDto } from './dto/update-competition-participation.dto';

const include: Prisma.CompetitionParticipationInclude = {
  team: true,
  competition: true,
  group: true,
  season: true,
};

interface CsvInput {
  teamId: number;
  competitionId: number;
  seasonId: number;
  groupId?: number;
}
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

  async createManyFromCsv(file: Express.Multer.File) {
    const result = parseCsv<CsvInput>(file.buffer.toString());

    const instances = result.data.map((item) => {
      const instance = new CreateCompetitionParticipationDto();

      instance.teamId = item.teamId?.toString();
      instance.competitionId = item.competitionId?.toString();
      instance.seasonId = item.seasonId?.toString();
      instance.groupId = item.groupId?.toString();

      return instance;
    });

    await validateInstances(instances);

    const createdDocuments: CompetitionParticipation[] = [];
    const errors: any[] = [];

    for (const [index, instance] of instances.entries()) {
      try {
        const created = await this.create(instance);
        createdDocuments.push(created);
      } catch (error) {
        errors.push({ index, error });
      }
    }

    return {
      csvRowsCount: result.data.length,
      createdCount: createdDocuments.length,
      errors,
    };
  }

  async findAll(
    {
      limit,
      page,
      sortBy,
      sortingOrder,
    }: CompetitionParticipationsPaginationOptionsDto,
    {
      competitionId,
      groupId,
      seasonId,
      teamId,
    }: FindAllCompetitionParticipationsDto,
  ) {
    let sort: Prisma.CompetitionParticipationOrderByWithRelationInput;

    switch (sortBy) {
      case 'seasonId':
        sort = { season: { endDate: sortingOrder } };
        break;
      case 'teamId':
        sort = { team: { name: sortingOrder } };
      case 'competitionId':
        sort = { competition: { level: sortingOrder } };
      case 'groupId':
        sort = { group: { name: sortingOrder } };
      default:
        break;
    }

    const where: Prisma.CompetitionParticipationWhereInput = {
      seasonId,
      competitionId,
      groupId,
      teamId,
    };

    const participations = await this.prisma.competitionParticipation.findMany({
      where,
      take: limit,
      skip: calculateSkip(page, limit),
      orderBy: sort,
      include,
    });

    const total = await this.prisma.competitionParticipation.count({ where });

    return formatPaginatedResponse({
      docs: participations,
      totalDocs: total,
      limit,
      page,
    });
  }

  getList() {
    return this.prisma.competitionParticipation.findMany({ include });
  }

  findOne(id: string) {
    return this.prisma.competitionParticipation.findUnique({
      where: { id },
      include,
    });
  }

  update(
    id: string,
    updateCompetitionParticipationDto: UpdateCompetitionParticipationDto,
  ) {
    return this.prisma.competitionParticipation.update({
      where: { id },
      data: updateCompetitionParticipationDto,
      include,
    });
  }

  remove(id: string) {
    return this.prisma.competitionParticipation.delete({
      where: { id },
      include,
    });
  }

  async copyFromSeasonToSeason(
    fromSeasonId: string,
    toSeasonId: string,
    lang: string,
  ) {
    if (fromSeasonId === toSeasonId) {
      const message = this.i18n.translate(
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
