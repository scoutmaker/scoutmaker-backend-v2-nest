import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateUserPlayerAceDto } from './dto/create-user-player-ace.dto';
import { UpdateUserPlayerAceDto } from './dto/update-user-player-ace.dto';
import { UserPlayerAclService } from './user-player-acl.service';

@Controller('user-player-acl')
export class UserPlayerAclController {
  constructor(private readonly aclService: UserPlayerAclService) {}

  @Post()
  create(@Body() createAceDto: CreateUserPlayerAceDto) {
    return this.aclService.create(createAceDto);
  }

  @Get()
  findAll() {
    return this.aclService.findAll();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAceDto: UpdateUserPlayerAceDto,
  ) {
    return this.aclService.update(id, updateAceDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aclService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aclService.remove(id);
  }
}
