import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlayerPositionsService } from './player-positions.service';
import { CreatePlayerPositionDto } from './dto/create-player-position.dto';
import { UpdatePlayerPositionDto } from './dto/update-player-position.dto';

@Controller('player-positions')
export class PlayerPositionsController {
  constructor(private readonly playerPositionsService: PlayerPositionsService) {}

  @Post()
  create(@Body() createPlayerPositionDto: CreatePlayerPositionDto) {
    return this.playerPositionsService.create(createPlayerPositionDto);
  }

  @Get()
  findAll() {
    return this.playerPositionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playerPositionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlayerPositionDto: UpdatePlayerPositionDto) {
    return this.playerPositionsService.update(+id, updatePlayerPositionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.playerPositionsService.remove(+id);
  }
}
