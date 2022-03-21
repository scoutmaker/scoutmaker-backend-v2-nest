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

import { ApiPaginatedResponse } from '../../api-response/api-paginated-response.decorator';
import { ApiResponse } from '../../api-response/api-response.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { PaginationOptions } from '../../pagination/pagination-options.decorator';
import { formatSuccessResponse } from '../../utils/helpers';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { CurrentUserDto } from '../users/dto/current-user.dto';
import { CreatePlayerDto } from './dto/create-player.dto';
import { FindAllPlayersDto } from './dto/find-all-players.dto';
import { PlayerBasicDataDto, PlayerDto } from './dto/player.dto';
import { PlayersPaginationOptionsDto } from './dto/players-pagination-options.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { PlayersService } from './players.service';

@Controller('players')
@ApiTags('players')
@UseGuards(AuthGuard)
@ApiCookieAuth()
export class PlayersController {
  constructor(
    private readonly playersService: PlayersService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(PlayerDto, { type: 'create' })
  @Serialize(PlayerDto)
  async create(
    @I18nLang() lang: string,
    @Body() createPlayerDto: CreatePlayerDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const player = await this.playersService.create(createPlayerDto, user.id);
    const message = await this.i18n.translate('players.CREATE_MESSAGE', {
      lang,
      args: { name: `${player.firstName} ${player.lastName}` },
    });
    return formatSuccessResponse(message, player);
  }

  @Get()
  @ApiPaginatedResponse(PlayerDto)
  @ApiQuery({ type: PlayersPaginationOptionsDto })
  @Serialize(PlayerDto, 'docs')
  async findAll(
    @I18nLang() lang: string,
    @PaginationOptions() paginationOptions: PlayersPaginationOptionsDto,
    @Query() query: FindAllPlayersDto,
  ) {
    const data = await this.playersService.findAll(paginationOptions, query);
    const message = await this.i18n.translate('players.GET_ALL_MESSAGE', {
      lang,
      args: { currentPage: data.page, totalPages: data.totalPages },
    });
    return formatSuccessResponse(message, data);
  }

  @Get('list')
  @ApiResponse(PlayerBasicDataDto, { type: 'read' })
  @Serialize(PlayerBasicDataDto)
  async getList(@I18nLang() lang: string) {
    const players = await this.playersService.getList();
    const message = await this.i18n.translate('players.GET_LIST_MESSAGE', {
      lang,
    });
    return formatSuccessResponse(message, players);
  }

  @Get(':id')
  @ApiResponse(PlayerDto, { type: 'read' })
  @Serialize(PlayerDto)
  async findOne(@I18nLang() lang: string, @Param('id') id: string) {
    const player = await this.playersService.findOne(id);
    const message = await this.i18n.translate('players.GET_ONE_MESSAGE', {
      lang,
      args: { name: `${player.firstName} ${player.lastName}` },
    });
    return formatSuccessResponse(message, player);
  }

  @Patch(':id')
  @ApiResponse(PlayerDto, { type: 'update' })
  @Serialize(PlayerDto)
  async update(
    @I18nLang() lang: string,
    @Param('id') id: string,
    @Body() updatePlayerDto: UpdatePlayerDto,
  ) {
    const player = await this.playersService.update(id, updatePlayerDto);
    const message = await this.i18n.translate('players.UPDATE_MESSAGE', {
      lang,
      args: { name: `${player.firstName} ${player.lastName}` },
    });
    return formatSuccessResponse(message, player);
  }

  @Delete(':id')
  @ApiResponse(PlayerDto, { type: 'delete' })
  @Serialize(PlayerDto)
  async remove(@I18nLang() lang: string, @Param('id') id: string) {
    const player = await this.playersService.remove(id);
    const message = await this.i18n.translate('players.DELETE_MESSAGE', {
      lang,
      args: { name: `${player.firstName} ${player.lastName}` },
    });
    return formatSuccessResponse(message, player);
  }
}
