import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';

const include: Prisma.PlayerInclude = {
  country: true,
  primaryPosition: true,
  secondaryPositions: { include: { position: true } },
  teams: true,
};

@Injectable()
export class PlayersService {
  constructor(private readonly prisma: PrismaService) {}

  create(createPlayerDto: CreatePlayerDto, authorId: string) {
    const {
      countryId,
      primaryPositionId,
      secondaryPositionIds,
      teamId,
      ...rest
    } = createPlayerDto;

    return this.prisma.player.create({
      data: {
        ...rest,
        country: { connect: { id: countryId } },
        primaryPosition: { connect: { id: primaryPositionId } },
        secondaryPositions:
          secondaryPositionIds && secondaryPositionIds.length > 0
            ? {
                createMany: {
                  data: secondaryPositionIds.map((id) => ({
                    playerPositionId: id,
                  })),
                },
              }
            : undefined,
        teams: { create: { teamId, startDate: new Date(), endDate: null } },
        author: { connect: { id: authorId } },
      },
      include,
    });
  }

  findAll() {
    return this.prisma.player.findMany({ include });
  }

  findOne(id: string) {
    return `This action returns a #${id} player`;
  }

  update(id: string, updatePlayerDto: UpdatePlayerDto) {
    return `This action updates a #${id} player`;
  }

  remove(id: string) {
    return `This action removes a #${id} player`;
  }
}
