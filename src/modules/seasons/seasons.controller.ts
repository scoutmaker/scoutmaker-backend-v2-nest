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
import { I18nLang, I18nService } from 'nestjs-i18n';

import { ApiResponse } from '../../common/api-response/api-response.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { formatSuccessResponse } from '../../utils/helpers';
import { CreateSeasonDto } from './dto/create-season.dto';
import { SeasonDto } from './dto/season.dto';
import { ToggleIsActiveDto } from './dto/toggle-is-active.dto';
import { UpdateSeasonDto } from './dto/update-season.dto';
import { SeasonsService } from './seasons.service';

@Controller('seasons')
@ApiTags('seasons')
@UseGuards(AuthGuard, new RoleGuard(['ADMIN']))
@ApiCookieAuth()
@Serialize(SeasonDto)
export class SeasonsController {
  constructor(
    private readonly seasonsService: SeasonsService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(SeasonDto, { type: 'create' })
  async create(
    @I18nLang() lang: string,
    @Body() createSeasonDto: CreateSeasonDto,
  ) {
    const season = await this.seasonsService.create(createSeasonDto);
    const message = await this.i18n.translate('seasons.CREATE_MESSAGE', {
      lang,
      args: { name: season.name },
    });
    return formatSuccessResponse(message, season);
  }

  @Get()
  @ApiResponse(SeasonDto, { type: 'read' })
  async findAll(@I18nLang() lang: string) {
    const seasons = await this.seasonsService.findAll();
    const message = await this.i18n.translate('seasons.GET_LIST_MESSAGE', {
      lang,
    });
    return formatSuccessResponse(message, seasons);
  }

  @Get(':id')
  @ApiResponse(SeasonDto, { type: 'read' })
  async findOne(@I18nLang() lang: string, @Param('id') id: string) {
    const season = await this.seasonsService.findOne(id);
    const message = await this.i18n.translate('seasons.GET_ONE_MESSAGE', {
      lang,
      args: { name: season.name },
    });
    return formatSuccessResponse(message, season);
  }

  @Patch(':id')
  @ApiResponse(SeasonDto, { type: 'update' })
  async update(
    @I18nLang() lang: string,
    @Param('id') id: string,
    @Body() updateSeasonDto: UpdateSeasonDto,
  ) {
    const season = await this.seasonsService.update(id, updateSeasonDto);
    const message = await this.i18n.translate('seasons.UPDATE_MESSAGE', {
      lang,
      args: { name: season.name },
    });
    return formatSuccessResponse(message, season);
  }

  @Patch(':id/toggle-active')
  @ApiResponse(SeasonDto, { type: 'update' })
  async toggleIsActive(
    @I18nLang() lang: string,
    @Param('id') id: string,
    @Body() toggleIsActiveDto: ToggleIsActiveDto,
  ) {
    const { isActive } = toggleIsActiveDto;
    const season = await this.seasonsService.toggleIsActive(
      id,
      toggleIsActiveDto,
    );

    const deactivateMessage = await this.i18n.translate(
      'seasons.DEACTIVATE_MESSAGE',
      { lang, args: { name: season.name } },
    );
    const activateMessage = await this.i18n.translate(
      'seasons.ACTIVATE_MESSAGE',
      { lang, args: { name: season.name } },
    );

    const message = isActive ? activateMessage : deactivateMessage;

    return formatSuccessResponse(message, season);
  }

  @Delete(':id')
  @ApiResponse(SeasonDto, { type: 'delete' })
  async remove(@I18nLang() lang: string, @Param('id') id: string) {
    const season = await this.seasonsService.remove(id);
    const message = await this.i18n.translate('seasons.DELETE_MESSAGE', {
      lang,
      args: { name: season.name },
    });
    return formatSuccessResponse(message, season);
  }
}
