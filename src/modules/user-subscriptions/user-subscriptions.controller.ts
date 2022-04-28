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
import { ApiCookieAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { I18nLang, I18nService } from 'nestjs-i18n';

import { ApiPaginatedResponse } from '../../common/api-response/api-paginated-response.decorator';
import { ApiResponse } from '../../common/api-response/api-response.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { PaginationOptions } from '../../common/pagination/pagination-options.decorator';
import { formatSuccessResponse } from '../../utils/helpers';
import { CreateUserSubscriptionDto } from './dto/create-user-subscription.dto';
import { FindAllUserSubscriptionsDto } from './dto/find-all-user-subscriptions.dto';
import { UpdateUserSubscriptionDto } from './dto/update-user-subscription.dto';
import { UserSubscriptionDto } from './dto/user-subscription.dto';
import { UserSubscriptionsPaginationOptionsDto } from './dto/user-subscriptions-pagination-options.dto';
import { UserSubscriptionsService } from './user-subscriptions.service';

@Controller('user-subscriptions')
@ApiTags('user subscriptions')
@UseGuards(AuthGuard, new RoleGuard(['ADMIN']))
@ApiCookieAuth()
export class UserSubscriptionsController {
  constructor(
    private readonly userSubscriptionsService: UserSubscriptionsService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(UserSubscriptionDto, { type: 'read' })
  @Serialize(UserSubscriptionDto)
  async create(
    @I18nLang() lang: string,
    @Body() createUserSubscriptionDto: CreateUserSubscriptionDto,
  ) {
    const subscription = await this.userSubscriptionsService.create(
      createUserSubscriptionDto,
    );
    const message = this.i18n.translate('user-subscriptions.CREATE_MESSAGE', {
      lang,
      args: {
        userName: `${subscription.user.firstName} ${subscription.user.lastName}`,
      },
    });
    return formatSuccessResponse(message, subscription);
  }

  @Get()
  @ApiPaginatedResponse(UserSubscriptionDto)
  @ApiQuery({ type: UserSubscriptionsPaginationOptionsDto })
  @Serialize(UserSubscriptionDto, 'docs')
  async findAll(
    @I18nLang() lang: string,
    @PaginationOptions()
    paginationOptions: UserSubscriptionsPaginationOptionsDto,
    @Query() query: FindAllUserSubscriptionsDto,
  ) {
    const data = await this.userSubscriptionsService.findAll(
      paginationOptions,
      query,
    );
    const message = this.i18n.translate('user-subscriptions.GET_ALL_MESSAGE', {
      lang,
      args: {
        currentPage: data.page,
        totalPages: data.totalPages,
      },
    });
    return formatSuccessResponse(message, data);
  }

  @Get(':id')
  @ApiResponse(UserSubscriptionDto, { type: 'read' })
  @Serialize(UserSubscriptionDto)
  async findOne(@I18nLang() lang: string, @Param('id') id: string) {
    const subscription = await this.userSubscriptionsService.findOne(id);
    const message = this.i18n.translate('user-subscriptions.GET_ONE_MESSAGE', {
      lang,
      args: {
        userName: `${subscription.user.firstName} ${subscription.user.lastName}`,
      },
    });
    return formatSuccessResponse(message, subscription);
  }

  @Patch(':id')
  @ApiResponse(UserSubscriptionDto, { type: 'read' })
  @Serialize(UserSubscriptionDto)
  async update(
    @I18nLang() lang: string,

    @Param('id') id: string,
    @Body() updateUserSubscriptionDto: UpdateUserSubscriptionDto,
  ) {
    const subscription = await this.userSubscriptionsService.update(
      id,
      updateUserSubscriptionDto,
    );
    const message = this.i18n.translate('user-subscriptions.UPDATE_MESSAGE', {
      lang,
      args: {
        userName: `${subscription.user.firstName} ${subscription.user.lastName}`,
      },
    });
    return formatSuccessResponse(message, subscription);
  }

  @Delete(':id')
  @ApiResponse(UserSubscriptionDto, { type: 'read' })
  @Serialize(UserSubscriptionDto)
  async remove(@I18nLang() lang: string, @Param('id') id: string) {
    const subscription = await this.userSubscriptionsService.remove(id);
    const message = this.i18n.translate('user-subscriptions.DELETE_MESSAGE', {
      lang,
      args: {
        userName: `${subscription.user.firstName} ${subscription.user.lastName}`,
      },
    });
    return formatSuccessResponse(message, subscription);
  }
}
