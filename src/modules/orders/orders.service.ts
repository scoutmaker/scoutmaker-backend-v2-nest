import { Injectable } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { ChangeOrderStatusDto } from './dto/change-order-status.dto';
import { CreateOrderDto } from './dto/create-order.dto';

const include: Prisma.OrderInclude = {
  author: true,
  scout: true,
  player: { include: { primaryPosition: true, country: true } },
  match: { include: { homeTeam: true, awayTeam: true, competition: true } },
};

const { author, scout, ...listInclude } = include;

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

  findAll() {
    return `This action returns all orders`;
  }

  getList() {
    return 'This action returns all orders list';
  }

  findOne(id: string) {
    return `This action returns a #${id} order`;
  }

  changeStatus(
    id: string,
    changeOrderStatusDto: ChangeOrderStatusDto,
    userRole: UserRole,
  ) {
    return `This action updates a #${id} order`;
  }

  remove(id: string) {
    return `This action removes a #${id} order`;
  }
}
