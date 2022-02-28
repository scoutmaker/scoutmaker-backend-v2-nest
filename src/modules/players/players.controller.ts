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
import { PlayerDto } from './dto/player.dto';
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
    console.log({ query });

    const data = await this.playersService.findAll(paginationOptions, query);
    return formatSuccessResponse('Successfully fetched all players', data);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const player = await this.playersService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePlayerDto: UpdatePlayerDto,
  ) {
    const player = await this.playersService.update(id, updatePlayerDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const player = await this.playersService.remove(id);
  }
}
