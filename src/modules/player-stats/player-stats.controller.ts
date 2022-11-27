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
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { PaginationOptions } from '../../common/pagination/pagination-options.decorator';
import { formatSuccessResponse } from '../../utils/helpers';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { CurrentUserDto } from '../users/dto/current-user.dto';
import { CreatePlayerStatsDto } from './dto/create-player-stats.dto';
import { FindAllPlayerStatsDto } from './dto/find-all-player-stats.dto';
import { PlayerStatsDto } from './dto/player-stats.dto';
import { PlayerStatsPaginationOptionsDto } from './dto/player-stats-pagination-options.dto';
import { UpdatePlayerStatsDto } from './dto/update-player-stats.dto';
import { PlayerStatsService } from './player-stats.service';

@Controller('player-stats')
@ApiTags('player stats')
@UseGuards(AuthGuard)
@ApiSecurity('auth-token')
export class PlayerStatsController {
  constructor(
    private readonly playerStatsService: PlayerStatsService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(PlayerStatsDto, { type: 'create' })
  @Serialize(PlayerStatsDto)
  async create(
    @I18nLang() lang: string,
    @Body() createPlayerStatsDto: CreatePlayerStatsDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const stats = await this.playerStatsService.create(
      createPlayerStatsDto,
      user.id,
    );
    const message = this.i18n.translate('player-stats.CREATE_MESSAGE', {
      lang,
      args: {
        playerName: `${stats.player.firstName} ${stats.player.lastName}`,
        matchName: `${stats.match.homeTeam.name} vs. ${stats.match.awayTeam.name}`,
      },
    });
    return formatSuccessResponse(message, stats);
  }

  @Get()
  @ApiPaginatedResponse(PlayerStatsDto)
  @ApiQuery({ type: PlayerStatsPaginationOptionsDto })
  @Serialize(PlayerStatsDto, 'docs')
  async findAll(
    @I18nLang() lang: string,
    @PaginationOptions() paginationOptions: PlayerStatsPaginationOptionsDto,
    @Query() query: FindAllPlayerStatsDto,
  ) {
    const data = await this.playerStatsService.findAll(
      paginationOptions,
      query,
    );
    const message = this.i18n.translate('player-stats.GET_ALL_MESSAGE', {
      lang,
      args: {
        currentPage: data.page,
        totalPages: data.totalPages,
      },
    });
    return formatSuccessResponse(message, data);
  }

  @Get(':id')
  @ApiResponse(PlayerStatsDto, { type: 'read' })
  @Serialize(PlayerStatsDto)
  async findOne(@I18nLang() lang: string, @Param('id') id: string) {
    const stats = await this.playerStatsService.findOne(id);
    const message = this.i18n.translate('player-stats.GET_ONE_MESSAGE', {
      lang,
      args: {
        playerName: `${stats.player.firstName} ${stats.player.lastName}`,
        matchName: `${stats.match.homeTeam.name} vs. ${stats.match.awayTeam.name}`,
      },
    });
    return formatSuccessResponse(message, stats);
  }

  @Patch(':id')
  @ApiResponse(PlayerStatsDto, { type: 'update' })
  @Serialize(PlayerStatsDto)
  async update(
    @I18nLang() lang: string,
    @Param('id') id: string,
    @Body() updatePlayerStatDto: UpdatePlayerStatsDto,
  ) {
    const stats = await this.playerStatsService.update(id, updatePlayerStatDto);
    const message = this.i18n.translate('player-stats.UPDATE_MESSAGE', {
      lang,
      args: {
        playerName: `${stats.player.firstName} ${stats.player.lastName}`,
        matchName: `${stats.match.homeTeam.name} vs. ${stats.match.awayTeam.name}`,
      },
    });
    return formatSuccessResponse(message, stats);
  }

  @Delete(':id')
  @ApiResponse(PlayerStatsDto, { type: 'delete' })
  @Serialize(PlayerStatsDto)
  async remove(@I18nLang() lang: string, @Param('id') id: string) {
    const stats = await this.playerStatsService.remove(id);
    const message = this.i18n.translate('player-stats.DELETE_MESSAGE', {
      lang,
      args: {
        playerName: `${stats.player.firstName} ${stats.player.lastName}`,
        matchName: `${stats.match.homeTeam.name} vs. ${stats.match.awayTeam.name}`,
      },
    });
    return formatSuccessResponse(message, stats);
  }
}
