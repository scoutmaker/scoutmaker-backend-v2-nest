import { Injectable } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';

import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { ChangeOrderStatusDto } from './dto/change-order-status.dto';
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

  changeStatus(
    id: string,
    changeOrderStatusDto: ChangeOrderStatusDto,
    userRole: UserRole,
  ) {
    return `This action updates a #${id} order`;
  }

  remove(id: string) {
    return this.prisma.order.delete({ where: { id }, include });
  }
}
