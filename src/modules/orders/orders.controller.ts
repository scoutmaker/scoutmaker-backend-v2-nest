import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

import { ApiPaginatedResponse } from '../../api-response/api-paginated-response.decorator';
import { ApiResponse } from '../../api-response/api-response.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { RoleGuard } from '../../guards/role.guard';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { formatSuccessResponse } from '../../utils/helpers';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { CurrentUserDto } from '../users/dto/current-user.dto';
import { ChangeOrderStatusDto } from './dto/change-order-status.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderDto } from './dto/order.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
@ApiTags('orders')
@UseGuards(AuthGuard, new RoleGuard(['ADMIN', 'PLAYMAKER_SCOUT']))
@ApiCookieAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiResponse(OrderDto, { type: 'create' })
  @Serialize(OrderDto)
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const order = await this.ordersService.create(createOrderDto, user.id);
    return formatSuccessResponse('Successfully created new order', order);
  }

  @Get()
  @ApiPaginatedResponse(OrderDto)
  // TODO: add api query decorator
  @Serialize(OrderDto, 'docs')
  async findAll() {
    const data = await this.ordersService.findAll();
    return formatSuccessResponse('Successfully fetched all orders', data);
  }

  @Get('list')
  @ApiResponse(OrderDto, { type: 'read' })
  // TODO: add api query decorator
  @Serialize(OrderDto)
  async getList() {
    const orders = await this.ordersService.getList();
    return formatSuccessResponse(
      'Successfully fetched all orders list',
      orders,
    );
  }

  @Get(':id')
  @ApiResponse(OrderDto, { type: 'read' })
  @Serialize(OrderDto)
  async findOne(@Param('id') id: string) {
    const order = await this.ordersService.findOne(id);
    return formatSuccessResponse(`Successfully fetched order #${id}`, order);
  }

  @Patch(':id/change-status')
  @ApiResponse(OrderDto, { type: 'update' })
  @Serialize(OrderDto)
  async update(
    @Param('id') id: string,
    @Body() changeOrderStatusDto: ChangeOrderStatusDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const order = await this.ordersService.changeStatus(
      id,
      changeOrderStatusDto,
      user.role,
    );
    return formatSuccessResponse(
      `Successfully changed order #${id} status`,
      order,
    );
  }

  @Delete(':id')
  @ApiResponse(OrderDto, { type: 'delete' })
  @Serialize(OrderDto)
  async remove(@Param('id') id: string) {
    const order = await this.ordersService.remove(id);
    return formatSuccessResponse(`Successfully removed order #${id}`, order);
  }
}
