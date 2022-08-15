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
import { CompetitionTypesService } from './competition-types.service';
import { CompetitionTypeDto } from './dto/competition-type.dto';
import { CompetitionTypesPaginationOptionsDto } from './dto/competition-types-pagination-options.dto';
import { CreateCompetitionTypeDto } from './dto/create-competition-type.dto';
import { FindAllCompetitionTypesDto } from './dto/find-all-competition-types.dto';
import { UpdateCompetitionTypeDto } from './dto/update-competition-type.dto';

@Controller('competition-types')
@ApiTags('competition types')
@UseGuards(AuthGuard, new RoleGuard(['ADMIN']))
@ApiCookieAuth()
export class CompetitionTypesController {
  constructor(
    private readonly typesService: CompetitionTypesService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(CompetitionTypeDto, { type: 'create' })
  @Serialize(CompetitionTypeDto)
  async create(
    @I18nLang() lang: string,
    @Body() createCompetitionTypeDto: CreateCompetitionTypeDto,
  ) {
    const type = await this.typesService.create(createCompetitionTypeDto);
    const message = this.i18n.translate('competition-types.CREATE_MESSAGE', {
      lang,
      args: { name: type.name },
    });
    return formatSuccessResponse(message, type);
  }

  @Get()
  @ApiPaginatedResponse(CompetitionTypeDto)
  @ApiQuery({ type: CompetitionTypesPaginationOptionsDto })
  @Serialize(CompetitionTypeDto, 'docs')
  async findAll(
    @I18nLang() lang: string,
    @PaginationOptions()
    paginationOptions: CompetitionTypesPaginationOptionsDto,
    @Query() query: FindAllCompetitionTypesDto,
  ) {
    const data = await this.typesService.findAll(paginationOptions, query);
    const message = this.i18n.translate('competition-types.GET_ALL_MESSAGE', {
      lang,
      args: { currentPage: data.page, totalPages: data.totalPages },
    });
    return formatSuccessResponse(message, data);
  }

  @Get('list')
  @ApiResponse(CompetitionTypeDto, { type: 'read', isArray: true })
  @Serialize(CompetitionTypeDto)
  async getList(@I18nLang() lang: string) {
    const types = await this.typesService.getList();
    const message = this.i18n.translate('competition-types.GET_LIST_MESSAGE', {
      lang,
    });
    return formatSuccessResponse(message, types);
  }

  @Get(':id')
  @ApiResponse(CompetitionTypeDto, { type: 'read' })
  @Serialize(CompetitionTypeDto)
  async findOne(
    @I18nLang() lang: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const type = await this.typesService.findOne(id);
    const message = this.i18n.translate('competition-types.GET_ONE_MESSAGE', {
      lang,
      args: { name: type.name },
    });
    return formatSuccessResponse(message, type);
  }

  @Patch(':id')
  @ApiResponse(CompetitionTypeDto, { type: 'update' })
  @Serialize(CompetitionTypeDto)
  async update(
    @I18nLang() lang: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCompetitionTypeDto: UpdateCompetitionTypeDto,
  ) {
    const type = await this.typesService.update(id, updateCompetitionTypeDto);
    const message = this.i18n.translate('competition-types.UPDATE_MESSAGE', {
      lang,
      args: { name: type.name },
    });
    return formatSuccessResponse(message, type);
  }

  @Delete(':id')
  @ApiResponse(CompetitionTypeDto, { type: 'delete' })
  @Serialize(CompetitionTypeDto)
  async remove(
    @I18nLang() lang: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const type = await this.typesService.remove(id);
    const message = this.i18n.translate('competition-types.DELETE_MESSAGE', {
      lang,
      args: { name: type.name },
    });
    return formatSuccessResponse(message, type);
  }
}
