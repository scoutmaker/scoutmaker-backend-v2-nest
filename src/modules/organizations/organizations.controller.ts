import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
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
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { FindAllOrganizationsDto } from './dto/find-all-organizations.dto';
import { OrganizationDto } from './dto/organization.dto';
import { OrganizationsPaginationOptionsDto } from './dto/organizations-pagination-options.dto';
import { ToggleMembershipDto } from './dto/toggle-membership.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationsService } from './organizations.service';

@Controller('organizations')
@ApiTags('organizations')
@UseGuards(AuthGuard, new RoleGuard(['ADMIN']))
@ApiCookieAuth()
export class OrganizationsController {
  constructor(
    private readonly organizationsService: OrganizationsService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(OrganizationDto, { type: 'create' })
  @Serialize(OrganizationDto)
  async create(
    @I18nLang() lang: string,
    @Body() createOrganizationDto: CreateOrganizationDto,
  ) {
    const organization = await this.organizationsService.create(
      createOrganizationDto,
      lang,
    );
    const message = this.i18n.translate('organizations.CREATE_MESSAGE', {
      lang,
      args: { name: organization.name },
    });
    return formatSuccessResponse(message, organization);
  }

  @Get()
  @ApiPaginatedResponse(OrganizationDto)
  @ApiQuery({ type: OrganizationsPaginationOptionsDto })
  @Serialize(OrganizationDto, 'docs')
  async findAll(
    @I18nLang() lang: string,
    @PaginationOptions()
    paginationOptions: OrganizationsPaginationOptionsDto,
    @Query() query: FindAllOrganizationsDto,
  ) {
    const data = await this.organizationsService.findAll(
      paginationOptions,
      query,
    );
    const message = this.i18n.translate('organizations.GET_ALL_MESSAGE', {
      lang,
      args: { currentPage: data.page, totalPages: data.totalPages },
    });
    return formatSuccessResponse(message, data);
  }

  @Get('list')
  @ApiResponse(OrganizationDto, { type: 'read' })
  @Serialize(OrganizationDto)
  async getList(@I18nLang() lang: string) {
    const organizations = await this.organizationsService.getList();
    const message = this.i18n.translate('organizations.GET_LIST_MESSAGE', {
      lang,
    });
    return formatSuccessResponse(message, organizations);
  }

  @Get(':id')
  @ApiResponse(OrganizationDto, { type: 'read' })
  @Serialize(OrganizationDto)
  async findOne(
    @I18nLang() lang: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const organization = await this.organizationsService.findOne(id);
    const message = this.i18n.translate('organizations.GET_ONE_MESSAGE', {
      lang,
      args: { name: organization.name },
    });
    return formatSuccessResponse(message, organization);
  }

  @Patch(':id')
  @ApiResponse(OrganizationDto, { type: 'update' })
  @Serialize(OrganizationDto)
  async update(
    @I18nLang() lang: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    const organization = await this.organizationsService.update(
      id,
      updateOrganizationDto,
    );
    const message = this.i18n.translate('organizations.UPDATE_MESSAGE', {
      lang,
      args: { name: organization.name },
    });
    return formatSuccessResponse(message, organization);
  }

  @Patch(':id/add-member')
  @ApiResponse(OrganizationDto, { type: 'update' })
  @Serialize(OrganizationDto)
  async addMember(
    @I18nLang() lang: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() toggleMembershipDto: ToggleMembershipDto,
  ) {
    const organization = await this.organizationsService.addMember(
      id,
      toggleMembershipDto,
      lang,
    );
    const message = this.i18n.translate('organizations.ADD_MEMBER_MESSAGE', {
      lang,
      args: { name: organization.name },
    });
    return formatSuccessResponse(message, organization);
  }

  @Patch(':id/remove-member')
  @ApiResponse(OrganizationDto, { type: 'update' })
  @Serialize(OrganizationDto)
  async removeMember(
    @I18nLang() lang: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() toggleMembershipDto: ToggleMembershipDto,
  ) {
    const organization = await this.organizationsService.removeMember(
      id,
      toggleMembershipDto,
    );
    const message = this.i18n.translate('organizations.REMOVE_MEMBER_MESSAGE', {
      lang,
      args: { name: organization.name },
    });
    return formatSuccessResponse(message, organization);
  }

  @Delete(':id')
  @ApiResponse(OrganizationDto, { type: 'delete' })
  @Serialize(OrganizationDto)
  async remove(
    @I18nLang() lang: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const organization = await this.organizationsService.remove(id);
    const message = this.i18n.translate('organizations.REMOVE_MESSAGE', {
      lang,
      args: { name: organization.name },
    });
    return formatSuccessResponse(message, organization);
  }
}
