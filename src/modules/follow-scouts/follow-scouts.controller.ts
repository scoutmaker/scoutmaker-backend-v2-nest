import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateFollowScoutDto } from './dto/create-follow-scout.dto';
import { FollowScoutsService } from './follow-scouts.service';

@Controller('follow-scouts')
export class FollowScoutsController {
  constructor(private readonly followScoutsService: FollowScoutsService) {}

  @Post()
  create(@Body() createFollowScoutDto: CreateFollowScoutDto) {
    return this.followScoutsService.create(createFollowScoutDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.followScoutsService.remove(+id);
  }
}
