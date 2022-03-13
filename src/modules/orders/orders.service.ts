import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserDto } from '../users/dto/current-user.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { FindAllOrdersDto } from './dto/find-all-orders.dto';
import { OrdersPaginationOptionsDto } from './dto/orders-pagination-options.dto';

const include: Prisma.OrderInclude = {
  author: true,
  scout: true,
  player: { include: { primaryPosition: true, country: true } },
  match: { include: { homeTeam: true, awayTeam: true, competition: true } },
};

const { author, scout, ...listInclude } = include;

listInclude.player = true;

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

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
    playerId,
    matchId,
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
      matchId,
      playerId,
      scout: { id: userId },
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

  findOne(id: string) {
    return this.prisma.order.findUnique({ where: { id }, include });
  }

  async accept(id: string, userId: string) {
    const order = await this.findOne(id);

    if (order.status !== 'OPEN') {
      throw new BadRequestException('Order is already accepted or closed');
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

  async reject(id: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { ...include, reports: true },
    });

    if (order.status !== 'ACCEPTED') {
      throw new BadRequestException(
        'You cannot reject an order with the status other than ACCEPTED',
      );
    }

    if (order.scoutId !== userId) {
      throw new BadRequestException(
        'You cannot reject an order that you did not accept',
      );
    }

    if (order.reports.length > 0) {
      throw new BadRequestException(
        'You cannot reject an order with reports already assigned to it',
      );
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

  async close(id: string, user: CurrentUserDto) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { ...include, reports: true },
    });

    if (order.authorId !== user.id || user.role !== 'ADMIN') {
      throw new UnauthorizedException(
        'You are not authorized to close this order',
      );
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

  remove(id: string) {
    return this.prisma.order.delete({ where: { id }, include });
  }
}
