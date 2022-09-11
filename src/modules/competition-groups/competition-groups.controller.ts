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
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { PaginationOptions } from '../../common/pagination/pagination-options.decorator';
import { formatSuccessResponse } from '../../utils/helpers';
import { CompetitionGroupsService } from './competition-groups.service';
import {
  CompetitionGroupBasicDataDto,
  CompetitionGroupDto,
} from './dto/competition-group.dto';
import { CompetitionGroupsPaginationOptionsDto } from './dto/competition-groups-pagination-options.dto';
import { CreateCompetitionGroupDto } from './dto/create-competition-group.dto';
import { FindAllCompetitionGroupsDto } from './dto/find-all-competition-groups.dto';
import { UpdateCompetitionGroupDto } from './dto/update-competition-group.dto';

@Controller('competition-groups')
@ApiTags('competition groups')
@UseGuards(AuthGuard)
@ApiCookieAuth()
export class CompetitionGroupsController {
  constructor(
    private readonly groupsService: CompetitionGroupsService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(CompetitionGroupDto, { type: 'create' })
  @Serialize(CompetitionGroupDto)
  async create(
    @I18nLang() lang: string,
    @Body() createCompetitionGroupDto: CreateCompetitionGroupDto,
  ) {
    const group = await this.groupsService.create(createCompetitionGroupDto);
    const message = this.i18n.translate('competition-groups.CREATE_MESSAGE', {
      lang,
      args: { name: group.name },
    });
    return formatSuccessResponse(message, group);
  }

  @Get()
  @ApiPaginatedResponse(CompetitionGroupDto)
  @ApiQuery({ type: CompetitionGroupsPaginationOptionsDto })
  @Serialize(CompetitionGroupDto, 'docs')
  async findAll(
    @I18nLang() lang: string,
    @PaginationOptions()
    paginationOptions: CompetitionGroupsPaginationOptionsDto,
    @Query() query: FindAllCompetitionGroupsDto,
  ) {
    const data = await this.groupsService.findAll(paginationOptions, query);
    const message = this.i18n.translate('competition-groups.GET_ALL_MESSAGE', {
      lang,
      args: { currentPage: data.page, totalPages: data.totalPages },
    });
    return formatSuccessResponse(message, data);
  }

  @Get('list')
  @ApiResponse(CompetitionGroupBasicDataDto, { type: 'read', isArray: true })
  @Serialize(CompetitionGroupBasicDataDto)
  async getList(@I18nLang() lang: string) {
    const groups = await this.groupsService.getList();
    const message = this.i18n.translate('competition-groups.GET_LIST_MESSAGE', {
      lang,
    });
    return formatSuccessResponse(message, groups);
  }

  @Get(':id')
  @ApiResponse(CompetitionGroupDto, { type: 'read' })
  @Serialize(CompetitionGroupDto)
  async findOne(@I18nLang() lang: string, @Param('id') id: string) {
    const group = await this.groupsService.findOne(id);
    const message = this.i18n.translate('competition-groups.GET_ONE_MESSAGE', {
      lang,
      args: { name: group.name },
    });
    return formatSuccessResponse(message, group);
  }

  @Patch(':id')
  @ApiResponse(CompetitionGroupDto, { type: 'update' })
  @Serialize(CompetitionGroupDto)
  async update(
    @I18nLang() lang: string,
    @Param('id') id: string,
    @Body() updateCompetitionGroupDto: UpdateCompetitionGroupDto,
  ) {
    const group = await this.groupsService.update(
      id,
      updateCompetitionGroupDto,
    );
    const message = this.i18n.translate('competition-groups.UPDATE_MESSAGE', {
      lang,
      args: { name: group.name },
    });
    return formatSuccessResponse(message, group);
  }

  @Delete(':id')
  @ApiResponse(CompetitionGroupDto, { type: 'delete' })
  @Serialize(CompetitionGroupDto)
  async remove(@I18nLang() lang: string, @Param('id') id: string) {
    const group = await this.groupsService.remove(id);
    const message = this.i18n.translate('competition-groups.DELETE_MESSAGE', {
      lang,
      args: { name: group.name },
    });
    return formatSuccessResponse(message, group);
  }
}
