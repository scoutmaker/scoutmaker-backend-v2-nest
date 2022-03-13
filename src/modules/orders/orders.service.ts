import { Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';

import { ChangeOrderStatusDto } from './dto/change-order-status.dto';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  create(createOrderDto: CreateOrderDto, authorId: string) {
    return 'This action adds a new order';
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
