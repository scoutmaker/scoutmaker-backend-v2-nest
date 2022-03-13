import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { FollowTeamsService } from './follow-teams.service';

@Controller('follow-teams')
export class FollowTeamsController {
  constructor(private readonly followTeamsService: FollowTeamsService) {}

  @Post()
  create() {
    return this.followTeamsService.create();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.followTeamsService.remove(+id);
  }
}
