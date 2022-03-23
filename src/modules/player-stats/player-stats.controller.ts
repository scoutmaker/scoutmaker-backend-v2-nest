import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreatePlayerStatsDto } from './dto/create-player-stats.dto';
import { UpdatePlayerStatsDto } from './dto/update-player-stats.dto';
import { PlayerStatsService } from './player-stats.service';

@Controller('player-stats')
export class PlayerStatsController {
  constructor(private readonly playerStatsService: PlayerStatsService) {}

  @Post()
  create(@Body() createPlayerStatDto: CreatePlayerStatsDto) {
    return this.playerStatsService.create(createPlayerStatDto);
  }

  @Get()
  findAll() {
    return this.playerStatsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playerStatsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePlayerStatDto: UpdatePlayerStatsDto,
  ) {
    return this.playerStatsService.update(+id, updatePlayerStatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.playerStatsService.remove(+id);
  }
}
