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
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { PaginationOptions } from '../../common/pagination/pagination-options.decorator';
import { formatSuccessResponse } from '../../utils/helpers';
import { CreatePlayerPositionDto } from './dto/create-player-position.dto';
import { FindAllPlayerPositionsDto } from './dto/find-all-player-positions.dto';
import { PlayerPositionDto } from './dto/player-position.dto';
import { PlayerPositionsPaginationOptionsDto } from './dto/player-positions-pagination-options.dto';
import { UpdatePlayerPositionDto } from './dto/update-player-position.dto';
import { PlayerPositionsService } from './player-positions.service';

@Controller('player-positions')
@ApiTags('player positions')
@UseGuards(AuthGuard)
@ApiCookieAuth()
export class PlayerPositionsController {
  constructor(
    private readonly positionsService: PlayerPositionsService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(PlayerPositionDto, { type: 'create' })
  @Serialize(PlayerPositionDto)
  async create(
    @I18nLang() lang: string,
    @Body() createPlayerPositionDto: CreatePlayerPositionDto,
  ) {
    const position = await this.positionsService.create(
      createPlayerPositionDto,
    );
    const message = this.i18n.translate('player-positions.CREATE_MESSAGE', {
      lang,
      args: { name: position.name },
    });
    return formatSuccessResponse(message, position);
  }

  @Get()
  @ApiPaginatedResponse(PlayerPositionDto)
  @ApiQuery({ type: PlayerPositionsPaginationOptionsDto })
  @Serialize(PlayerPositionDto, 'docs')
  async findAll(
    @I18nLang() lang: string,
    @PaginationOptions()
    paginationOptions: PlayerPositionsPaginationOptionsDto,
    @Query() query: FindAllPlayerPositionsDto,
  ) {
    const data = await this.positionsService.findAll(paginationOptions, query);
    const message = this.i18n.translate('player-positions.GET_ALL_MESSAGE', {
      lang,
      args: { currentPage: data.page, totalPages: data.totalPages },
    });
    return formatSuccessResponse(message, data);
  }

  @Get('list')
  @ApiResponse(PlayerPositionDto, { type: 'read', isArray: true })
  @Serialize(PlayerPositionDto)
  async getList(@I18nLang() lang: string) {
    const positions = await this.positionsService.getList();
    const message = this.i18n.translate('player-positions.GET_LIST_MESSAGE', {
      lang,
    });
    return formatSuccessResponse(message, positions);
  }

  @Get(':id')
  @ApiResponse(PlayerPositionDto, { type: 'read' })
  @Serialize(PlayerPositionDto)
  async findOne(@I18nLang() lang: string, @Param('id') id: string) {
    const position = await this.positionsService.findOne(id);
    const message = this.i18n.translate('player-positions.GET_ONE_MESSAGE', {
      lang,
      args: { name: position.name },
    });
    return formatSuccessResponse(message, position);
  }

  @Patch(':id')
  @ApiResponse(PlayerPositionDto, { type: 'update' })
  @Serialize(PlayerPositionDto)
  async update(
    @I18nLang() lang: string,
    @Param('id') id: string,
    @Body() updatePlayerPositionDto: UpdatePlayerPositionDto,
  ) {
    const position = await this.positionsService.update(
      id,
      updatePlayerPositionDto,
    );
    const message = this.i18n.translate('player-positions.UPDATE_MESSAGE', {
      lang,
      args: { name: position.name },
    });
    return formatSuccessResponse(message, position);
  }

  @Delete(':id')
  @ApiResponse(PlayerPositionDto, { type: 'delete' })
  @Serialize(PlayerPositionDto)
  async remove(@I18nLang() lang: string, @Param('id') id: string) {
    const position = await this.positionsService.remove(id);
    const message = this.i18n.translate('player-positions.DELETE_MESSAGE', {
      lang,
      args: { name: position.name },
    });
    return formatSuccessResponse(message, position);
  }
}
