import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { I18nService } from 'nestjs-i18n';

import {
  calculateSkip,
  formatPaginatedResponse,
  isIdsArrayFilterDefined,
} from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserDto } from '../users/dto/current-user.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { FindAllOrdersDto } from './dto/find-all-orders.dto';
import { OrdersPaginationOptionsDto } from './dto/orders-pagination-options.dto';

const include: Prisma.OrderInclude = {
  author: true,
  scout: true,
  player: {
    include: {
      primaryPosition: true,
      country: true,
      teams: { where: { endDate: null }, include: { team: true } },
    },
  },
  match: { include: { homeTeam: true, awayTeam: true, competition: true } },
  _count: { select: { reports: true } },
};

const { author, scout, ...listInclude } = include;

listInclude.player = true;

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  create(createOrderDto: CreateOrderDto, authorId: string) {
    const { matchId, playerId, ...rest } = createOrderDto;

    return this.prisma.order.create({
      data: {
        ...rest,
        player: playerId ? { connect: { id: playerId } } : undefined,
        match: matchId ? { connect: { id: matchId } } : undefined,
        author: { connect: { id: authorId } },
      },
      include,
    });
  }

  private generateWhereClause({
    userId,
    playerIds,
    matchIds,
    teamIds,
    status,
    createdAfter,
    createdBefore,
  }: FindAllOrdersDto): Prisma.OrderWhereInput {
    return {
      createdAt: {
        gte: createdAfter ? new Date(createdAfter) : undefined,
        lte: createdBefore ? new Date(createdBefore) : undefined,
      },
      status,
      scout: { id: userId },
      player: isIdsArrayFilterDefined(playerIds)
        ? { id: { in: playerIds } }
        : undefined,
      match: isIdsArrayFilterDefined(matchIds)
        ? { id: { in: matchIds } }
        : undefined,
      OR: isIdsArrayFilterDefined(teamIds)
        ? [
            { match: { homeTeam: { id: { in: teamIds } } } },
            { match: { awayTeam: { id: { in: teamIds } } } },
            {
              player: {
                teams: {
                  some: {
                    endDate: null,
                    team: { id: { in: teamIds } },
                  },
                },
              },
            },
          ]
        : undefined,
    };
  }

  async findAll(
    { limit, page, sortBy, sortingOrder }: OrdersPaginationOptionsDto,
    query: FindAllOrdersDto,
  ) {
    let sort: Prisma.OrderOrderByWithRelationInput;

    switch (sortBy) {
      case 'player':
      case 'scout':
        sort = { [sortBy]: { lastName: sortingOrder } };
        break;
      case 'position':
        sort = { player: { primaryPosition: { name: sortingOrder } } };
        break;
      default:
        sort = { [sortBy]: sortingOrder };
        break;
    }

    const where = this.generateWhereClause(query);

    const orders = await this.prisma.order.findMany({
      where,
      take: limit,
      skip: calculateSkip(page, limit),
      orderBy: sort,
      include,
    });

    const total = await this.prisma.order.count({ where });

    return formatPaginatedResponse({
      docs: orders,
      totalDocs: total,
      limit,
      page,
    });
  }

  getList(query: FindAllOrdersDto) {
    return this.prisma.order.findMany({
      where: this.generateWhereClause(query),
      include: listInclude,
    });
  }

  findOne(id: number) {
    return this.prisma.order.findUnique({ where: { id }, include });
  }

  async accept(id: number, userId: string, lang: string) {
    const order = await this.findOne(id);

    if (order.status !== 'OPEN') {
      const message = this.i18n.translate('orders.ACCEPT_STATUS_ERROR', {
        lang,
        args: { docNumber: order.docNumber },
      });
      throw new BadRequestException(message);
    }

    return this.prisma.order.update({
      where: { id },
      data: {
        status: 'ACCEPTED',
        scout: { connect: { id: userId } },
        acceptDate: new Date(),
      },
      include,
    });
  }

  async reject(id: number, userId: string, lang: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { ...include, reports: true },
    });

    if (order.status !== 'ACCEPTED') {
      const message = this.i18n.translate('orders.REJECT_STATUS_ERROR', {
        lang,
        args: { docNumber: order.docNumber },
      });
      throw new BadRequestException(message);
    }

    if (order.scoutId !== userId) {
      const message = this.i18n.translate('orders.REJECT_ASSIGNEE_ERROR', {
        lang,
        args: { docNumber: order.docNumber },
      });
      throw new BadRequestException(message);
    }

    if (order.reports.length > 0) {
      const message = this.i18n.translate('orders.REJECT_REPORTS_ERROR', {
        lang,
        args: {
          docNumber: order.docNumber,
          reportsCount: order.reports.length,
        },
      });
      throw new BadRequestException(message);
    }

    return this.prisma.order.update({
      where: { id },
      data: {
        status: 'OPEN',
        scout: { disconnect: true },
        acceptDate: null,
      },
      include,
    });
  }

  async close(id: number, user: CurrentUserDto, lang: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { ...include, reports: true },
    });

    if (order.authorId !== user.id || user.role !== 'ADMIN') {
      const message = this.i18n.translate('orders.CLOSE_ROLE_ERROR', {
        lang,
        args: { docNumber: order.docNumber },
      });
      throw new UnauthorizedException(message);
    }

    return this.prisma.order.update({
      where: { id },
      data: {
        status: 'CLOSED',
        closeDate: new Date(),
      },
      include,
    });
  }

  remove(id: number) {
    return this.prisma.order.delete({ where: { id }, include });
  }
}
