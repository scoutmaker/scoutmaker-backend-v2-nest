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

import { ApiResponse } from '../../common/api-response/api-response.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { PaginationOptions } from '../../common/pagination/pagination-options.decorator';
import { formatSuccessResponse } from '../../utils/helpers';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { CurrentUserDto } from '../users/dto/current-user.dto';
import { AgenciesService } from './agencies.service';
import { AgenciesPaginationOptions } from './dto/agencies-pagination-options.dto';
import { AgencyBasicInfoDto, AgencyDto } from './dto/agency.dto';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { FindAllAgenciesDto } from './dto/find-all-agencies.dto';
import { UpdateAgencyDto } from './dto/update-agency.dto';

@Controller('agencies')
@ApiTags('agencies')
@UseGuards(AuthGuard)
@ApiSecurity('auth-token')
export class AgenciesController {
  constructor(
    private readonly agenciesService: AgenciesService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(AgencyDto, { type: 'create' })
  @Serialize(AgencyDto)
  async create(
    @I18nLang() lang: string,
    @Body() createAgencyDto: CreateAgencyDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const agency = await this.agenciesService.create(createAgencyDto, user.id);
    const message = this.i18n.translate('agencies.CREATE_MESSAGE', {
      lang,
      args: { name: agency.name },
    });
    return formatSuccessResponse(message, agency);
  }

  @Get()
  @ApiResponse(AgencyDto, { type: 'read' })
  @ApiQuery({ type: AgenciesPaginationOptions })
  @Serialize(AgencyDto, 'docs')
  async findAll(
    @I18nLang() lang: string,
    @PaginationOptions() paginationOptions: AgenciesPaginationOptions,
    @Query() query: FindAllAgenciesDto,
  ) {
    const data = await this.agenciesService.findAll(paginationOptions, query);
    const message = this.i18n.translate('agencies.GET_ALL_MESSAGE', {
      lang,
      args: { currentPage: data.page, totalPages: data.totalPages },
    });
    return formatSuccessResponse(message, data);
  }

  @Get('list')
  @ApiResponse(AgencyBasicInfoDto, { type: 'read' })
  @Serialize(AgencyBasicInfoDto)
  async getList(@I18nLang() lang: string) {
    const agencies = await this.agenciesService.getList();
    const message = this.i18n.translate('agencies.GET_LIST_MESSAGE', {
      lang,
    });
    return formatSuccessResponse(message, agencies);
  }

  @Get(':id')
  @ApiResponse(AgencyDto, { type: 'read' })
  @Serialize(AgencyDto)
  async findOne(@I18nLang() lang: string, @Param('id') id: string) {
    const agency = await this.agenciesService.findOne(id);
    const message = this.i18n.translate('agencies.GET_ONE_MESSAGE', {
      lang,
      args: { name: agency.name },
    });
    return formatSuccessResponse(message, agency);
  }

  @Patch(':id')
  @ApiResponse(AgencyDto, { type: 'update' })
  @Serialize(AgencyDto)
  async update(
    @I18nLang() lang: string,
    @Param('id') id: string,
    @Body() updateAgencyDto: UpdateAgencyDto,
  ) {
    const agency = await this.agenciesService.update(id, updateAgencyDto);
    const message = this.i18n.translate('agencies.UPDATE_MESSAGE', {
      lang,
      args: { name: agency.name },
    });
    return formatSuccessResponse(message, agency);
  }

  @Delete(':id')
  @ApiResponse(AgencyDto, { type: 'delete' })
  @Serialize(AgencyDto)
  async remove(@I18nLang() lang: string, @Param('id') id: string) {
    const agency = await this.agenciesService.remove(id);
    const message = this.i18n.translate('agencies.DELETE_MESSAGE', {
      lang,
      args: { name: agency.name },
    });
    return formatSuccessResponse(message, agency);
  }
}
