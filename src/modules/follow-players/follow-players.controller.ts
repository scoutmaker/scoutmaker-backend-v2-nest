import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateFollowPlayerDto } from './dto/create-follow-player.dto';
import { FollowPlayersService } from './follow-players.service';

@Controller('follow-players')
export class FollowPlayersController {
  constructor(private readonly followPlayersService: FollowPlayersService) {}

  @Post()
  create(@Body() createFollowPlayerDto: CreateFollowPlayerDto) {
    return this.followPlayersService.create(createFollowPlayerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.followPlayersService.remove(+id);
  }
}
