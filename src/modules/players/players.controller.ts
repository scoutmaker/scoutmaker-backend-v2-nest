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
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @ApiResponse(PlayerDto, { type: 'create' })
  async create(
    @Body() createPlayerDto: CreatePlayerDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const player = await this.playersService.create(createPlayerDto, user.id);
    return formatSuccessResponse('Successfully created new player', player);
  }

  @Get()
  @ApiPaginatedResponse(PlayerDto)
  @ApiQuery({ type: PlayersPaginationOptionsDto })
  @Serialize(PlayerDto, 'docs')
  async findAll(
    @PaginationOptions() paginationOptions: PlayersPaginationOptionsDto,
    @Query() query: FindAllPlayersDto,
  ) {
    const data = await this.playersService.findAll(paginationOptions, query);
    return formatSuccessResponse('Successfully fetched all players', data);
  }

  @Get('list')
  @ApiResponse(PlayerBasicDataDto, { type: 'read' })
  @Serialize(PlayerBasicDataDto)
  async getList() {
    const players = await this.playersService.getList();
    return formatSuccessResponse(
      'Successully fetched all players list',
      players,
    );
  }

  @Get(':id')
  @ApiResponse(PlayerDto, { type: 'read' })
  @Serialize(PlayerDto)
  async findOne(@Param('id') id: string) {
    const player = await this.playersService.findOne(id);
    return formatSuccessResponse(
      `Successfully fetched player with the id of ${id}`,
      player,
    );
  }

  @Patch(':id')
  @ApiResponse(PlayerDto, { type: 'update' })
  @Serialize(PlayerDto)
  async update(
    @Param('id') id: string,
    @Body() updatePlayerDto: UpdatePlayerDto,
  ) {
    const player = await this.playersService.update(id, updatePlayerDto);
    return formatSuccessResponse(
      `Successfully updated player with the id of ${id}`,
      player,
    );
  }

  @Delete(':id')
  @ApiResponse(PlayerDto, { type: 'delete' })
  @Serialize(PlayerDto)
  async remove(@Param('id') id: string) {
    const player = await this.playersService.remove(id);
    return formatSuccessResponse(
      `Successfully removed player with the id of ${id}`,
      player,
    );
  }
}
