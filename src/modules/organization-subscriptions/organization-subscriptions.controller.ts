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
import { ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { I18nLang, I18nService } from 'nestjs-i18n';

import { ApiPaginatedResponse } from '../../common/api-response/api-paginated-response.decorator';
import { ApiResponse } from '../../common/api-response/api-response.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { PaginationOptions } from '../../common/pagination/pagination-options.decorator';
import { formatSuccessResponse } from '../../utils/helpers';
import { CreateOrganizationSubscriptionDto } from './dto/create-organization-subscription.dto';
import { FindAllOrganizationSubscriptionsDto } from './dto/find-all-organization-subscriptions.dto';
import { OrganizationSubscriptionDto } from './dto/organization-subscription.dto';
import { OrganizationSubscriptionsPaginationOptionsDto } from './dto/organization-subscriptions-pagination-options.dto';
import { UpdateOrganizationSubscriptionDto } from './dto/update-organization-subscription.dto';
import { OrganizationSubscriptionsService } from './organization-subscriptions.service';

@Controller('organization-subscriptions')
@ApiTags('organization subscriptions')
@UseGuards(AuthGuard, new RoleGuard(['ADMIN']))
@ApiSecurity('auth-token')
export class OrganizationSubscriptionsController {
  constructor(
    private readonly organizationSubscriptionsService: OrganizationSubscriptionsService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(OrganizationSubscriptionDto, { type: 'read' })
  @Serialize(OrganizationSubscriptionDto)
  async create(
    @I18nLang() lang: string,
    @Body()
    createOrganizationSubscriptionDto: CreateOrganizationSubscriptionDto,
  ) {
    const subscription = await this.organizationSubscriptionsService.create(
      createOrganizationSubscriptionDto,
    );
    const message = this.i18n.translate(
      'organization-subscriptions.CREATE_MESSAGE',
      {
        lang,
        args: {
          name: subscription.organization.name,
        },
      },
    );
    return formatSuccessResponse(message, subscription);
  }

  @Get()
  @ApiPaginatedResponse(OrganizationSubscriptionDto)
  @ApiQuery({ type: OrganizationSubscriptionsPaginationOptionsDto })
  @Serialize(OrganizationSubscriptionDto, 'docs')
  async findAll(
    @I18nLang() lang: string,
    @PaginationOptions()
    paginationOptions: OrganizationSubscriptionsPaginationOptionsDto,
    @Query() query: FindAllOrganizationSubscriptionsDto,
  ) {
    const data = await this.organizationSubscriptionsService.findAll(
      paginationOptions,
      query,
    );
    const message = this.i18n.translate(
      'organization-subscriptions.GET_ALL_MESSAGE',
      {
        lang,
        args: {
          currentPage: data.page,
          totalPages: data.totalPages,
        },
      },
    );
    return formatSuccessResponse(message, data);
  }

  @Get(':id')
  @ApiResponse(OrganizationSubscriptionDto, { type: 'read' })
  @Serialize(OrganizationSubscriptionDto)
  async findOne(@I18nLang() lang: string, @Param('id') id: string) {
    const subscription = await this.organizationSubscriptionsService.findOne(
      id,
    );
    const message = this.i18n.translate(
      'organization-subscriptions.GET_ONE_MESSAGE',
      {
        lang,
        args: {
          name: subscription.organization.name,
        },
      },
    );
    return formatSuccessResponse(message, subscription);
  }

  @Patch(':id')
  @ApiResponse(OrganizationSubscriptionDto, { type: 'read' })
  @Serialize(OrganizationSubscriptionDto)
  async update(
    @I18nLang() lang: string,
    @Param('id') id: string,
    @Body()
    updateOrganizationSubscriptionDto: UpdateOrganizationSubscriptionDto,
  ) {
    const subscription = await this.organizationSubscriptionsService.update(
      id,
      updateOrganizationSubscriptionDto,
    );
    const message = this.i18n.translate(
      'organization-subscriptions.UPDATE_MESSAGE',
      {
        lang,
        args: {
          name: subscription.organization.name,
        },
      },
    );
    return formatSuccessResponse(message, subscription);
  }

  @Delete(':id')
  @ApiResponse(OrganizationSubscriptionDto, { type: 'read' })
  @Serialize(OrganizationSubscriptionDto)
  async remove(@I18nLang() lang: string, @Param('id') id: string) {
    const subscription = await this.organizationSubscriptionsService.remove(id);
    const message = this.i18n.translate(
      'organization-subscriptions.DELETE_MESSAGE',
      {
        lang,
        args: {
          name: subscription.organization.name,
        },
      },
    );
    return formatSuccessResponse(message, subscription);
  }
}
