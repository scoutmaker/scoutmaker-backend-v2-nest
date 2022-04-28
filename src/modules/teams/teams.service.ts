import { Injectable } from '@nestjs/common';
import { Prisma, Team } from '@prisma/client';
import slugify from 'slugify';

import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { FindAllTeamsDto } from './dto/find-all-teams.dto';
import { TeamsPaginationOptionsDto } from './dto/teams-pagination-options.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

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
          create: {
            competition: { connect: { id: competitionId } },
            group: groupId ? { connect: { id: groupId } } : undefined,
            season: { connect: { isActive: true } },
          },
        },
      },
      include,
    });
  }

  async findAll(
    { limit, page, sortBy, sortingOrder }: TeamsPaginationOptionsDto,
    { name, clubId, regionId, countryId }: FindAllTeamsDto,
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

    const where: Prisma.TeamWhereInput = {
      name,
      clubId,
      club:
        regionId || countryId
          ? { region: { id: regionId }, country: { id: countryId } }
          : undefined,
    };

    const teams = await this.prisma.team.findMany({
      where,
      take: limit,
      skip: calculateSkip(page, limit),
      orderBy: sort,
      include,
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

  findOne(id: string) {
    return this.prisma.team.findUnique({ where: { id }, include });
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
