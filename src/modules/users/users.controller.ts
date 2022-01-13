import { Controller, Get, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { ChangeRoleDto } from './dto/change-user-role.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { RoleGuard } from '../../guards/role.guard';
import { formatSuccessResponse } from '../../utils/helpers';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { ApiResponse } from '../../api-response/api-response.decorator';

@Controller('users')
@ApiTags('users')
@UseGuards(AuthGuard, new RoleGuard(['ADMIN']))
@ApiCookieAuth()
@Serialize(UserDto)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiResponse(UserDto, { type: 'read', isArray: true })
  async findAll() {
    const users = await this.usersService.findAll();
    return formatSuccessResponse('Successfully fetched all users', users);
  }

  @Get(':id')
  @ApiResponse(UserDto, { type: 'read' })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    return formatSuccessResponse('Successfully fetched user', user);
  }

  @Patch(':id/change-role')
  @ApiResponse(UserDto, { type: 'update' })
  async changeRole(@Param('id') id: string, @Body() { role }: ChangeRoleDto) {
    const user = await this.usersService.changeRole(id, role);
    return formatSuccessResponse(
      `Successfully changed user with the id of ${id} role to ${role}`,
      user,
    );
  }
}