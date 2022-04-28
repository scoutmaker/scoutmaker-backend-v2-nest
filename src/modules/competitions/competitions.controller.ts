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
import { CompetitionsService } from './competitions.service';
import { CompetitionBasicDataDto, CompetitionDto } from './dto/competition.dto';
import { CompetitionsPaginationOptionsDto } from './dto/competitions-pagination-options.dto';
import { CreateCompetitionDto } from './dto/create-competition.dto';
import { FindAllCompetitionsDto } from './dto/find-all-competitions.dto';
import { UpdateCompetitionDto } from './dto/update-competition.dto';

@Controller('competitions')
@ApiTags('competitions')
@UseGuards(AuthGuard, new RoleGuard(['ADMIN']))
@ApiCookieAuth()
export class CompetitionsController {
  constructor(
    private readonly competitionsService: CompetitionsService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(CompetitionDto, { type: 'create' })
  @Serialize(CompetitionDto)
  async create(
    @I18nLang() lang: string,
    @Body() createCompetitionDto: CreateCompetitionDto,
  ) {
    const competition = await this.competitionsService.create(
      createCompetitionDto,
    );
    const message = this.i18n.translate('competitions.CREATE_MESSAGE', {
      lang,
      args: { name: competition.name },
    });
    return formatSuccessResponse(message, competition);
  }

  @Get()
  @ApiPaginatedResponse(CompetitionDto)
  @ApiQuery({ type: CompetitionsPaginationOptionsDto })
  @Serialize(CompetitionDto, 'docs')
  async findAll(
    @I18nLang() lang: string,
    @PaginationOptions() paginationOptions: CompetitionsPaginationOptionsDto,
    @Query() query: FindAllCompetitionsDto,
  ) {
    const data = await this.competitionsService.findAll(
      paginationOptions,
      query,
    );
    const message = this.i18n.translate('competitions.GET_ALL_MESSAGE', {
      lang,
      args: { currentPage: data.page, totalPages: data.totalPages },
    });
    return formatSuccessResponse(message, data);
  }

  @Get('list')
  @ApiResponse(CompetitionBasicDataDto, { type: 'read' })
  @Serialize(CompetitionBasicDataDto)
  async getList(@I18nLang() lang: string) {
    const competition = await this.competitionsService.getList();
    const message = this.i18n.translate('competitions.GET_LIST_MESSAGE', {
      lang,
    });
    return formatSuccessResponse(message, competition);
  }

  @Get(':id')
  @ApiResponse(CompetitionDto, { type: 'read' })
  @Serialize(CompetitionDto)
  async findOne(@I18nLang() lang: string, @Param('id') id: string) {
    const competition = await this.competitionsService.findOne(id);
    const message = this.i18n.translate('competitions.GET_ONE_MESSAGE', {
      lang,
      args: { name: competition.name },
    });
    return formatSuccessResponse(message, competition);
  }

  @Patch(':id')
  @ApiResponse(CompetitionDto, { type: 'update' })
  @Serialize(CompetitionDto)
  async update(
    @I18nLang() lang: string,
    @Param('id') id: string,
    @Body() updateCompetitionDto: UpdateCompetitionDto,
  ) {
    const competition = await this.competitionsService.update(
      id,
      updateCompetitionDto,
    );
    const message = this.i18n.translate('competitions.UPDATE_MESSAGE', {
      lang,
      args: { name: competition.name },
    });
    return formatSuccessResponse(message, competition);
  }

  @Delete(':id')
  @ApiResponse(CompetitionDto, { type: 'delete' })
  @Serialize(CompetitionDto)
  async remove(@I18nLang() lang: string, @Param('id') id: string) {
    const competition = await this.competitionsService.remove(id);
    const message = this.i18n.translate('competitions.DELETE_MESSAGE', {
      lang,
      args: { name: competition.name },
    });
    return formatSuccessResponse(message, competition);
  }
}
