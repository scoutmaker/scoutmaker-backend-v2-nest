import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateFollowAgencyDto } from './dto/create-follow-agency.dto';
import { FollowAgenciesService } from './follow-agencies.service';

@Controller('follow-agencies')
export class FollowAgenciesController {
  constructor(private readonly followAgenciesService: FollowAgenciesService) {}

  @Post()
  create(@Body() createFollowAgencyDto: CreateFollowAgencyDto) {
    return this.followAgenciesService.create(createFollowAgencyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.followAgenciesService.remove(+id);
  }
}
