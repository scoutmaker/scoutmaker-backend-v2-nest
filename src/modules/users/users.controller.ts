import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { I18nLang, I18nService } from 'nestjs-i18n';

import { ApiResponse } from '../../common/api-response/api-response.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { formatSuccessResponse } from '../../utils/helpers';
import { ChangeRoleDto } from './dto/change-user-role.dto';
import { UserBasicDataDto, UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
@UseGuards(AuthGuard, new RoleGuard(['ADMIN']))
@ApiCookieAuth()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly i18n: I18nService,
  ) {}

  @Get('list')
  @ApiResponse(UserBasicDataDto, { type: 'read', isArray: true })
  @Serialize(UserBasicDataDto)
  async getList(@I18nLang() lang: string) {
    const users = await this.usersService.getList();
    const message = this.i18n.translate('users.GET_LIST_MESSAGE', {
      lang,
    });
    return formatSuccessResponse(message, users);
  }

  @Get(':id')
  @ApiResponse(UserDto, { type: 'read' })
  @Serialize(UserDto)
  async findOne(
    @I18nLang() lang: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const user = await this.usersService.findOne(id);
    const message = this.i18n.translate('users.GET_ONE_MESSAGE', {
      lang,
      args: { name: `${user.firstName} ${user.lastName}` },
    });
    return formatSuccessResponse(message, user);
  }

  @Patch(':id/change-role')
  @ApiResponse(UserDto, { type: 'update' })
  @Serialize(UserDto)
  async changeRole(
    @I18nLang() lang: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() { role }: ChangeRoleDto,
  ) {
    const user = await this.usersService.changeRole(id, role);
    const message = this.i18n.translate('users.CHANGE_ROLE_MESSAGE', {
      lang,
      args: {
        userName: `${user.firstName} ${user.lastName}`,
        roleName: user.role,
      },
    });
    return formatSuccessResponse(message, user);
  }
}
