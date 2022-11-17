import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiSecurity, ApiQuery, ApiTags } from '@nestjs/swagger';
import { I18nLang, I18nService } from 'nestjs-i18n';

import { ApiPaginatedResponse } from '../../common/api-response/api-paginated-response.decorator';
import { ApiResponse } from '../../common/api-response/api-response.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { PaginationOptions } from '../../common/pagination/pagination-options.decorator';
import { formatSuccessResponse } from '../../utils/helpers';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { CurrentUserDto } from '../users/dto/current-user.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { FindAllOrdersDto } from './dto/find-all-orders.dto';
import { OrderBasicDataDto, OrderDto } from './dto/order.dto';
import { OrdersPaginationOptionsDto } from './dto/orders-pagination-options.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
@ApiTags('orders')
@UseGuards(
  AuthGuard,
  new RoleGuard(['ADMIN', 'PLAYMAKER_SCOUT', 'PLAYMAKER_SCOUT_MANAGER']),
)
@ApiSecurity('auth-token')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(OrderDto, { type: 'create' })
  @Serialize(OrderDto)
  async create(
    @I18nLang() lang: string,
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const order = await this.ordersService.create(createOrderDto, user.id);
    const message = this.i18n.translate('orders.CREATE_MESSAGE', {
      lang,
      args: { docNumber: order.docNumber },
    });
    return formatSuccessResponse(message, order);
  }

  @Get()
  @ApiPaginatedResponse(OrderDto)
  @ApiQuery({ type: OrdersPaginationOptionsDto })
  @Serialize(OrderDto, 'docs')
  async findAll(
    @I18nLang() lang: string,
    @PaginationOptions() paginationOptions: OrdersPaginationOptionsDto,
    @Query() query: FindAllOrdersDto,
  ) {
    const data = await this.ordersService.findAll(paginationOptions, query);
    const message = this.i18n.translate('orders.GET_ALL_MESSAGE', {
      lang,
      args: {
        currentPage: data.page,
        totalPages: data.totalPages,
      },
    });
    return formatSuccessResponse(message, data);
  }

  @Get('list')
  @ApiResponse(OrderBasicDataDto, { type: 'read' })
  @Serialize(OrderBasicDataDto)
  async getList(@I18nLang() lang: string, @Query() query: FindAllOrdersDto) {
    const orders = await this.ordersService.getList(query);
    const message = this.i18n.translate('orders.GET_LIST_MESSAGE', {
      lang,
    });
    return formatSuccessResponse(message, orders);
  }

  @Get(':id')
  @ApiResponse(OrderDto, { type: 'read' })
  @Serialize(OrderDto)
  async findOne(@I18nLang() lang: string, @Param('id') id: string) {
    const order = await this.ordersService.findOne(id);
    const message = this.i18n.translate('orders.GET_ONE_MESSAGE', {
      lang,
      args: { docNumber: order.docNumber },
    });
    return formatSuccessResponse(message, order);
  }

  @Patch(':id/accept')
  @ApiResponse(OrderDto, { type: 'update' })
  @Serialize(OrderDto)
  async accept(
    @I18nLang() lang: string,
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const order = await this.ordersService.accept(id, user.id, lang);
    const message = this.i18n.translate('orders.ACCEPT_MESSAGE', {
      lang,
      args: { docNumber: order.docNumber },
    });
    return formatSuccessResponse(message, order);
  }

  @Patch(':id/reject')
  @ApiResponse(OrderDto, { type: 'update' })
  @Serialize(OrderDto)
  async reject(
    @I18nLang() lang: string,
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const order = await this.ordersService.reject(id, user.id, lang);
    const message = this.i18n.translate('orders.REJECT_MESSAGE', {
      lang,
      args: { docNumber: order.docNumber },
    });
    return formatSuccessResponse(message, order);
  }

  @Patch(':id/close')
  @ApiResponse(OrderDto, { type: 'update' })
  @Serialize(OrderDto)
  async close(
    @I18nLang() lang: string,
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const order = await this.ordersService.close(id, user, lang);
    const message = this.i18n.translate('orders.CLOSE_MESSAGE', {
      lang,
      args: { docNumber: order.docNumber },
    });
    return formatSuccessResponse(message, order);
  }

  @Delete(':id')
  @ApiResponse(OrderDto, { type: 'delete' })
  @Serialize(OrderDto)
  async remove(@I18nLang() lang: string, @Param('id') id: string) {
    const order = await this.ordersService.remove(id);
    const message = this.i18n.translate('orders.DELETE_MESSAGE', {
      lang,
      args: {
        docNumber: order.docNumber,
      },
    });
    return formatSuccessResponse(message, order);
  }
}
