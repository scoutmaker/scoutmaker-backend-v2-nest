import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { I18nLang, I18nService } from 'nestjs-i18n';

import { ApiPaginatedResponse } from '../../common/api-response/api-paginated-response.decorator';
import { ApiResponse } from '../../common/api-response/api-response.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { PaginationOptions } from '../../common/pagination/pagination-options.decorator';
import { formatSuccessResponse } from '../../utils/helpers';
import { CreateUserFootballRoleDto } from './dto/create-user-football-role.dto';
import { FindAllUserFootballRolesDto } from './dto/find-all-user-football-roles.dto';
import { UpdateUserFootballRoleDto } from './dto/update-user-football-role.dto';
import { UserFootballRoleDto } from './dto/user-football-role.dto';
import { UserFootballRolesPaginationOptionsDto } from './dto/user-football-roles-pagination-options.dto';
import { UserFootballRolesService } from './user-football-roles.service';

@Controller('user-football-roles')
@ApiTags('user football roles')
@UseGuards(AuthGuard)
@ApiCookieAuth()
export class UserFootballRolesController {
  constructor(
    private readonly rolesService: UserFootballRolesService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(UserFootballRoleDto, { type: 'read' })
  @Serialize(UserFootballRoleDto)
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
  @ApiPaginatedResponse(UserFootballRoleDto)
  @ApiQuery({ type: UserFootballRolesPaginationOptionsDto })
  @Serialize(UserFootballRoleDto, 'docs')
  async findAll(
    @I18nLang() lang: string,
    @PaginationOptions()
    paginationOptions: UserFootballRolesPaginationOptionsDto,
    @Query() query: FindAllUserFootballRolesDto,
  ) {
    const data = await this.rolesService.findAll(paginationOptions, query);
    const message = this.i18n.translate('user-football-roles.GET_ALL_MESSAGE', {
      lang,
      args: { currentPage: data.page, totalPages: data.totalPages },
    });
    return formatSuccessResponse(message, data);
  }

  @Get('list')
  @ApiResponse(UserFootballRoleDto, { type: 'read' })
  @Serialize(UserFootballRoleDto)
  async getList(@I18nLang() lang: string) {
    const roles = await this.rolesService.getList();
    const message = this.i18n.translate(
      'user-football-roles.GET_LIST_MESSAGE',
      { lang },
    );
    return formatSuccessResponse(message, roles);
  }

  @Get(':id')
  @ApiResponse(UserFootballRoleDto, { type: 'read' })
  @Serialize(UserFootballRoleDto)
  async findOne(
    @I18nLang() lang: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const role = await this.rolesService.findOne(id);
    const message = this.i18n.translate('user-football-roles.GET_ONE_MESSAGE', {
      lang,
      args: { name: role.name },
    });
    return formatSuccessResponse(message, role);
  }

  @Patch(':id')
  @ApiResponse(UserFootballRoleDto, { type: 'read' })
  @Serialize(UserFootballRoleDto)
  async update(
    @I18nLang() lang: string,
    @Param('id', ParseIntPipe) id: number,
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
  @Serialize(UserFootballRoleDto)
  async remove(
    @I18nLang() lang: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const role = await this.rolesService.remove(id);
    const message = this.i18n.translate('user-football-roles.DELETE_MESSAGE', {
      lang,
      args: { name: role.name },
    });
    return formatSuccessResponse(message, role);
  }
}
