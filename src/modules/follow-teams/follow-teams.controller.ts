import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateFollowTeamDto } from './dto/create-follow-team.dto';
import { FollowTeamsService } from './follow-teams.service';

@Controller('follow-teams')
export class FollowTeamsController {
  constructor(private readonly followTeamsService: FollowTeamsService) {}

  @Post()
  create(@Body() createFollowTeamDto: CreateFollowTeamDto) {
    return this.followTeamsService.create(createFollowTeamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.followTeamsService.remove(+id);
  }
}
