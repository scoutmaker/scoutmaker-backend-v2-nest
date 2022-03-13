import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { FollowPlayersService } from './follow-players.service';

@Controller('follow-players')
export class FollowPlayersController {
  constructor(private readonly followPlayersService: FollowPlayersService) {}

  @Post()
  create() {
    return this.followPlayersService.create();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.followPlayersService.remove(+id);
  }
}
