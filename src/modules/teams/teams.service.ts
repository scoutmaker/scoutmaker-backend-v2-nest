import { Injectable } from '@nestjs/common';
import { Prisma, Team } from '@prisma/client';
import slugify from 'slugify';

import { parseCsv, validateInstances } from '../../utils/csv-helpers';
import {
  calculateSkip,
  formatPaginatedResponse,
  isIdsArrayFilterDefined,
} from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { FindAllTeamsDto } from './dto/find-all-teams.dto';
import { TeamsPaginationOptionsDto } from './dto/teams-pagination-options.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

interface CsvInput {
  id: number;
  name: string;
  transfermarktUrl?: string;
  isPublic: boolean;
  scoutmakerv1Id?: string;
  clubId: number;
  authorId: number;
}

const include: Prisma.TeamInclude = {
  club: true,
  competitions: {
    where: { season: { isActive: true } },
    include: { competition: true, group: true, season: true },
  },
};
@Injectable()
export class TeamsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTeamDto: CreateTeamDto, authorId: string) {
    const { clubId, competitionId, groupId, ...rest } = createTeamDto;

    const slug = await this.generateSlug(rest.name);

    return this.prisma.team.create({
      data: {
        ...rest,
        slug,
        club: { connect: { id: clubId } },
        author: { connect: { id: authorId } },
        competitions: {
          create: competitionId
            ? {
                competition: { connect: { id: competitionId } },
                group: groupId ? { connect: { id: groupId } } : undefined,
                season: { connect: { isActive: true } },
              }
            : undefined,
        },
      },
      include,
    });
  }

  async createManyFromCsv(file: Express.Multer.File) {
    const result = parseCsv<CsvInput>(file.buffer.toString());

    const instances = result.data.map((item) => {
      const instance = new CreateTeamDto();
      instance.id = item.id?.toString();
      instance.name = item.name;
      instance.transfermarktUrl = item.transfermarktUrl;
      instance.isPublic = item.isPublic;
      instance.scoutmakerv1Id = item.scoutmakerv1Id;
      instance.clubId = item.clubId?.toString();

      return instance;
    });

    await validateInstances(instances);

    const createdDocuments: Team[] = [];
    const errors: any[] = [];

    for (const [index, instance] of instances.entries()) {
      try {
        const created = await this.create(
          instance,
          result.data[index].authorId?.toString(),
        );
        createdDocuments.push(created);
      } catch (error) {
        errors.push({ index, name: instance.name, error });
      }
    }

    return {
      csvRowsCount: result.data.length,
      createdCount: createdDocuments.length,
      errors,
    };
  }

  async findAll(
    { limit, page, sortBy, sortingOrder }: TeamsPaginationOptionsDto,
    {
      name,
      clubId,
      regionIds,
      countryIds,
      isLiked,
      competitionIds,
      competitionGroupIds,
    }: FindAllTeamsDto,
    userId?: string,
  ) {
    let sort: Prisma.TeamOrderByWithRelationInput;

    switch (sortBy) {
      case 'name':
        sort = { name: sortingOrder };
        break;
      case 'clubId':
        sort = { club: { name: sortingOrder } };
        break;
      case 'regionId':
        sort = { club: { region: { name: sortingOrder } } };
        break;
      case 'countryId':
        sort = { club: { country: { name: sortingOrder } } };
        break;
      default:
        sort = undefined;
        break;
    }

    const slugifiedQueryString = name
      ? slugify(name, { lower: true })
      : undefined;

    const where: Prisma.TeamWhereInput = {
      OR: name
        ? [
            {
              name: { contains: name, mode: 'insensitive' },
            },
            { slug: { contains: slugifiedQueryString, mode: 'insensitive' } },
          ]
        : undefined,
      clubId,
      likes: isLiked ? { some: { userId } } : undefined,
      AND: [
        {
          club: isIdsArrayFilterDefined(regionIds)
            ? { region: { id: { in: regionIds } } }
            : undefined,
        },
        {
          club: isIdsArrayFilterDefined(countryIds)
            ? { country: { id: { in: countryIds } } }
            : undefined,
        },
        {
          competitions: isIdsArrayFilterDefined(competitionIds)
            ? {
                some: {
                  season: { isActive: true },
                  competition: { id: { in: competitionIds } },
                },
              }
            : undefined,
        },
        {
          competitions: isIdsArrayFilterDefined(competitionGroupIds)
            ? {
                some: {
                  season: { isActive: true },
                  group: { id: { in: competitionGroupIds } },
                },
              }
            : undefined,
        },
      ],
    };

    const teams = await this.prisma.team.findMany({
      where,
      take: limit,
      skip: calculateSkip(page, limit),
      orderBy: sort,
      include: userId
        ? {
            ...include,
            likes: {
              where: { userId },
            },
          }
        : include,
    });

    const total = await this.prisma.team.count({ where });

    return formatPaginatedResponse({
      docs: teams,
      totalDocs: total,
      limit,
      page,
    });
  }

  getList() {
    return this.prisma.team.findMany();
  }

  findOne(id: string, userId?: string) {
    return this.prisma.team.findUnique({
      where: { id },
      include: userId
        ? {
            ...include,
            likes: {
              where: { userId },
            },
          }
        : include,
    });
  }

  findOneBySlug(slug: string, userId?: string) {
    return this.prisma.team.findUnique({
      where: { slug },
      include: userId
        ? {
            ...include,
            likes: {
              where: { userId },
            },
          }
        : include,
    });
  }

  findAllBySlug(slug: string) {
    return this.prisma.team.findMany({ where: { slug } });
  }

  async generateSlug(stringToSlugify: string) {
    const baseSlug = slugify(stringToSlugify, { lower: true });
    let i = 0;
    let teams: Team[];
    let slug = baseSlug;

    do {
      teams = await this.findAllBySlug(slug);
      if (teams.length !== 0) {
        i = i + 1;
        slug = `${baseSlug}-${i}`;
      }
    } while (teams.length !== 0);

    return slug;
  }

  update(id: string, updateTeamDto: UpdateTeamDto) {
    return this.prisma.team.update({
      where: { id },
      data: updateTeamDto,
      include,
    });
  }

  async remove(id: string) {
    await this.prisma.competitionParticipation.deleteMany({
      where: { teamId: id },
    });
    return this.prisma.team.delete({ where: { id }, include });
  }
}
