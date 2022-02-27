import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { CurrentUserDto } from '../users/dto/current-user.dto';
import { formatSuccessResponse } from '../../utils/helpers';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { PlayerDto } from './dto/player.dto';
import { ApiResponse } from '../../api-response/api-response.decorator';

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
  @ApiResponse(PlayerDto, { type: 'read', isArray: true })
  @Serialize(PlayerDto)
  async findAll() {
    const players = await this.playersService.findAll();
    return formatSuccessResponse('Successfully fetched all players', players);
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
