import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserFootballRolesService } from './user-football-roles.service';
import { CreateUserFootballRoleDto } from './dto/create-user-football-role.dto';
import { UpdateUserFootballRoleDto } from './dto/update-user-football-role.dto';

@Controller('user-football-roles')
export class UserFootballRolesController {
  constructor(private readonly userFootballRolesService: UserFootballRolesService) {}

  @Post()
  create(@Body() createUserFootballRoleDto: CreateUserFootballRoleDto) {
    return this.userFootballRolesService.create(createUserFootballRoleDto);
  }

  @Get()
  findAll() {
    return this.userFootballRolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userFootballRolesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserFootballRoleDto: UpdateUserFootballRoleDto) {
    return this.userFootballRolesService.update(+id, updateUserFootballRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userFootballRolesService.remove(+id);
  }
}
