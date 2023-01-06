import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { I18nLang, I18nService } from 'nestjs-i18n';

import { ApiPaginatedResponse } from '../../common/api-response/api-paginated-response.decorator';
import { ApiResponse } from '../../common/api-response/api-response.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { PaginationOptions } from '../../common/pagination/pagination-options.decorator';
import { formatSuccessResponse } from '../../utils/helpers';
import { CreatePlayerRoleDto } from './dto/create-player-role.dto';
import { FindAllPlayerRolesDto } from './dto/find-all-player-roles.dto';
import { PlayerRoleDto } from './dto/player-role.dto';
import { PlayerRolesPaginationOptionsDto } from './dto/player-roles-pagination-options.dto';
import { UpdatePlayerRoleDto } from './dto/update-player-role.dto';
import { PlayerRolesService } from './player-roles.service';

@Controller('player-roles')
@ApiTags('player roles')
@UseGuards(AuthGuard)
@ApiSecurity('auth-token')
export class PlayerRolesController {
  constructor(
    private readonly rolesService: PlayerRolesService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @UseGuards(new RoleGuard(['ADMIN']))
  @ApiResponse(PlayerRoleDto, { type: 'create' })
  @Serialize(PlayerRoleDto)
  async create(
    @I18nLang() lang: string,
    @Body() createPlayerRoleDto: CreatePlayerRoleDto,
  ) {
    const role = await this.rolesService.create(createPlayerRoleDto);
    const message = this.i18n.translate('player-roles.CREATE_MESSAGE', {
      lang,
      args: { name: role.name },
    });
    return formatSuccessResponse(message, role);
  }

  @Post('upload')
  @UseGuards(new RoleGuard(['ADMIN']))
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const { createdCount, csvRowsCount, errors } =
      await this.rolesService.createManyFromCsv(file);
    return formatSuccessResponse('Success!', {
      csvRowsCount,
      createdCount,
      errors,
    });
  }

  @Get()
  @UseGuards(new RoleGuard(['ADMIN']))
  @ApiPaginatedResponse(PlayerRoleDto)
  @ApiQuery({ type: PlayerRolesPaginationOptionsDto })
  @Serialize(PlayerRoleDto, 'docs')
  async findAll(
    @I18nLang() lang: string,
    @PaginationOptions()
    paginationOptions: PlayerRolesPaginationOptionsDto,
    @Query() query: FindAllPlayerRolesDto,
  ) {
    const data = await this.rolesService.findAll(paginationOptions, query);
    const message = this.i18n.translate('player-roles.GET_ALL_MESSAGE', {
      lang,
      args: { currentPage: data.page, totalPages: data.totalPages },
    });
    return formatSuccessResponse(message, data);
  }

  @Get('list')
  @ApiResponse(PlayerRoleDto, { type: 'read', isArray: true })
  @Serialize(PlayerRoleDto)
  async getList(@I18nLang() lang: string) {
    const roles = await this.rolesService.getList();
    const message = this.i18n.translate('player-roles.GET_LIST_MESSAGE', {
      lang,
    });
    return formatSuccessResponse(message, roles);
  }

  @Get(':id')
  @ApiResponse(PlayerRoleDto, { type: 'read' })
  @Serialize(PlayerRoleDto)
  async findOne(@I18nLang() lang: string, @Param('id') id: string) {
    const role = await this.rolesService.findOne(id);
    const message = this.i18n.translate('player-roles.GET_ONE_MESSAGE', {
      lang,
      args: { name: role.name },
    });
    return formatSuccessResponse(message, role);
  }

  @Patch(':id')
  @UseGuards(new RoleGuard(['ADMIN']))
  @ApiResponse(PlayerRoleDto, { type: 'update' })
  @Serialize(PlayerRoleDto)
  async update(
    @I18nLang() lang: string,
    @Param('id') id: string,
    @Body() updatePlayerRoleDto: UpdatePlayerRoleDto,
  ) {
    const role = await this.rolesService.update(id, updatePlayerRoleDto);
    const message = this.i18n.translate('player-roles.UPDATE_MESSAGE', {
      lang,
      args: { name: role.name },
    });
    return formatSuccessResponse(message, role);
  }

  @Delete(':id')
  @UseGuards(new RoleGuard(['ADMIN']))
  @ApiResponse(PlayerRoleDto, { type: 'delete' })
  @Serialize(PlayerRoleDto)
  async remove(@I18nLang() lang: string, @Param('id') id: string) {
    const role = await this.rolesService.remove(id);
    const message = this.i18n.translate('player-roles.DELETE_MESSAGE', {
      lang,
      args: { name: role.name },
    });
    return formatSuccessResponse(message, role);
  }
}
