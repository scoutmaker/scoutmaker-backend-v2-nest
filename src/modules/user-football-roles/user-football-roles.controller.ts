import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

import { ApiResponse } from '../../api-response/api-response.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { formatSuccessResponse } from '../../utils/helpers';
import { CreateUserFootballRoleDto } from './dto/create-user-football-role.dto';
import { UpdateUserFootballRoleDto } from './dto/update-user-football-role.dto';
import { UserFootballRoleDto } from './dto/user-football-role.dto';
import { UserFootballRolesService } from './user-football-roles.service';

@Controller('user-football-roles')
@ApiTags('user football roles')
@UseGuards(AuthGuard)
@ApiCookieAuth()
@Serialize(UserFootballRoleDto)
export class UserFootballRolesController {
  constructor(private readonly rolesService: UserFootballRolesService) {}

  @Post()
  @ApiResponse(UserFootballRoleDto, { type: 'read' })
  async create(@Body() createUserFootballRoleDto: CreateUserFootballRoleDto) {
    const role = await this.rolesService.create(createUserFootballRoleDto);
    return formatSuccessResponse('Successfully created new role', role);
  }

  @Get()
  @ApiResponse(UserFootballRoleDto, { type: 'read' })
  async findAll() {
    const roles = await this.rolesService.findAll();
    return formatSuccessResponse('Successfully fetched all roles', roles);
  }

  @Get(':id')
  @ApiResponse(UserFootballRoleDto, { type: 'read' })
  async findOne(@Param('id') id: string) {
    const role = await this.rolesService.findOne(id);
    return formatSuccessResponse(`Successfully fetched role ${id}`, role);
  }

  @Patch(':id')
  @ApiResponse(UserFootballRoleDto, { type: 'read' })
  async update(
    @Param('id') id: string,
    @Body() updateUserFootballRoleDto: UpdateUserFootballRoleDto,
  ) {
    const role = await this.rolesService.update(id, updateUserFootballRoleDto);
    return formatSuccessResponse(`Successfully updated role ${id}`, role);
  }

  @Delete(':id')
  @ApiResponse(UserFootballRoleDto, { type: 'read' })
  async remove(@Param('id') id: string) {
    const role = await this.rolesService.remove(id);
    return formatSuccessResponse(`Successfully removed role ${id}`, role);
  }
}
