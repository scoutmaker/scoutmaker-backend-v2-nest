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
import { I18nLang, I18nService } from 'nestjs-i18n';

import { ApiResponse } from '../../common/api-response/api-response.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
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
  constructor(
    private readonly rolesService: UserFootballRolesService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(UserFootballRoleDto, { type: 'read' })
  async create(
    @I18nLang() lang: string,
    @Body() createUserFootballRoleDto: CreateUserFootballRoleDto,
  ) {
    const role = await this.rolesService.create(createUserFootballRoleDto);
    const message = this.i18n.translate('user-football-roles.CREATE_MESSAGE', {
      lang,
      args: { name: role.name },
    });
    return formatSuccessResponse(message, role);
  }

  @Get()
  @ApiResponse(UserFootballRoleDto, { type: 'read' })
  async findAll(@I18nLang() lang: string) {
    const roles = await this.rolesService.findAll();
    const message = this.i18n.translate(
      'user-football-roles.GET_LIST_MESSAGE',
      { lang },
    );
    return formatSuccessResponse(message, roles);
  }

  @Get(':id')
  @ApiResponse(UserFootballRoleDto, { type: 'read' })
  async findOne(@I18nLang() lang: string, @Param('id') id: string) {
    const role = await this.rolesService.findOne(id);
    const message = this.i18n.translate('user-football-roles.GET_ONE_MESSAGE', {
      lang,
      args: { name: role.name },
    });
    return formatSuccessResponse(message, role);
  }

  @Patch(':id')
  @ApiResponse(UserFootballRoleDto, { type: 'read' })
  async update(
    @I18nLang() lang: string,
    @Param('id') id: string,
    @Body() updateUserFootballRoleDto: UpdateUserFootballRoleDto,
  ) {
    const role = await this.rolesService.update(id, updateUserFootballRoleDto);
    const message = this.i18n.translate('user-football-roles.UPDATE_MESSAGE', {
      lang,
      args: {
        name: role.name,
      },
    });
    return formatSuccessResponse(message, role);
  }

  @Delete(':id')
  @ApiResponse(UserFootballRoleDto, { type: 'read' })
  async remove(@I18nLang() lang: string, @Param('id') id: string) {
    const role = await this.rolesService.remove(id);
    const message = this.i18n.translate('user-football-roles.DELETE_MESSAGE', {
      lang,
      args: { name: role.name },
    });
    return formatSuccessResponse(message, role);
  }
}
