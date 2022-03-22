import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PlayersService } from '../players/players.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInsiderNoteDto } from './dto/create-insider-note.dto';
import { FindAllInsiderNotesDto } from './dto/find-all-insider-notes.dto';
import { InsiderNotesPaginationOptionsDto } from './dto/insider-notes-pagination-options.dto';
import { UpdateInsiderNoteDto } from './dto/update-insider-note.dto';

const include: Prisma.InsiderNoteInclude = {
  player: true,
  author: true,
};

@Injectable()
export class InsiderNotesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly playersService: PlayersService,
  ) {}

  async create(createInsiderNoteDto: CreateInsiderNoteDto, authorId: string) {
    const { playerId, teamId, competitionId, competitionGroupId, ...rest } =
      createInsiderNoteDto;

    const player = await this.playersService.findOneWithCurrentTeamDetails(
      playerId,
    );

    const metaTeamId = teamId || player.teams[0].teamId;
    const metaCompetitionId =
      competitionId || player.teams[0].team.competitions[0].competitionId;
    const metaCompetitionGroupId =
      competitionGroupId || player.teams[0].team.competitions[0].groupId;

    return this.prisma.insiderNote.create({
      data: {
        ...rest,
        player: { connect: { id: playerId } },
        author: { connect: { id: authorId } },
        meta: {
          create: {
            team: { connect: { id: metaTeamId } },
            competition: { connect: { id: metaCompetitionId } },
            competitionGroup: metaCompetitionGroupId
              ? { connect: { id: metaCompetitionGroupId } }
              : undefined,
          },
        },
      },
      include,
    });
  }

  async findAll(
    { limit, page, sortBy, sortingOrder }: InsiderNotesPaginationOptionsDto,
    { playerId }: FindAllInsiderNotesDto,
  ) {
    let sort: Prisma.InsiderNoteOrderByWithRelationInput;

    switch (sortBy) {
      case 'player':
        sort = { [sortBy]: { lastName: sortingOrder } };
        break;
      default:
        sort = { [sortBy]: sortingOrder };
        break;
    }

    const where: Prisma.InsiderNoteWhereInput = {
      playerId,
    };

    const insiderNotes = await this.prisma.insiderNote.findMany({
      where,
      take: limit,
      skip: calculateSkip(page, limit),
      orderBy: sort,
      include,
    });

    const total = await this.prisma.insiderNote.count({ where });

    return formatPaginatedResponse({
      docs: insiderNotes,
      totalDocs: total,
      limit,
      page,
    });
  }

  getList() {
    return this.prisma.insiderNote.findMany({ include });
  }

  findOne(id: string) {
    return this.prisma.insiderNote.findUnique({ where: { id }, include });
  }

  async update(id: string, updateInsiderNoteDto: UpdateInsiderNoteDto) {
    const { playerId, teamId, competitionId, competitionGroupId, ...rest } =
      updateInsiderNoteDto;

    let metaTeamId: string;
    let metaCompetitionId: string;
    let metaCompetitionGroupId: string | undefined;

    // If there's playerId in the update, we need to update the meta with calculated values
    if (playerId) {
      const player =
        this.playersService.findOneWithCurrentTeamDetails(playerId);

      metaTeamId = teamId || player.teams[0].teamId;
      metaCompetitionId =
        competitionId || player.teams[0].team.competitions[0].competitionId;
      metaCompetitionGroupId =
        competitionGroupId || player.teams[0].team.competitions[0].groupId;

      await this.prisma.insiderNoteMeta.update({
        where: { insiderNoteId: id },
        data: {
          teamId: metaTeamId,
          competitionId: metaCompetitionId,
          competitionGroupId: metaCompetitionGroupId,
        },
      });
    }

    // If there's no playerId in the update and there's meta data provided, we need to update the meta with provided values
    if (!playerId && (teamId || competitionId || competitionGroupId)) {
      await this.prisma.insiderNoteMeta.update({
        where: { insiderNoteId: id },
        data: {
          teamId,
          competitionId,
          competitionGroupId,
        },
      });
    }

    return this.prisma.insiderNote.update({
      where: { id },
      data: { ...rest, playerId },
      include,
    });
  }

  async remove(id: string) {
    await this.prisma.insiderNoteMeta.delete({ where: { insiderNoteId: id } });
    return this.prisma.insiderNote.delete({
      where: { id },
      include,
    });
  }
}
