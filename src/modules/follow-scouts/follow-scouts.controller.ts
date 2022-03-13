import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { FollowScoutsService } from './follow-scouts.service';

@Controller('follow-scouts')
export class FollowScoutsController {
  constructor(private readonly followScoutsService: FollowScoutsService) {}

  @Post()
  create() {
    return this.followScoutsService.create();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.followScoutsService.remove(+id);
  }
}
