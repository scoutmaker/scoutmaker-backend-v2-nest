import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import { RoleGuard } from '../../common/guards/role.guard';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { PaginationOptions } from '../../common/pagination/pagination-options.decorator';
import { formatSuccessResponse } from '../../utils/helpers';
import { CreateUserPlayerAceDto } from './dto/create-user-player-ace.dto';
import { FindAllUserPlayerAceDto } from './dto/find-all-user-player-ace.dto';
import { UpdateUserPlayerAceDto } from './dto/update-user-player-ace.dto';
import { UserPlayerAceDto } from './dto/user-player-ace.dto';
import { UserPlayerAcePaginationOptionsDto } from './dto/user-player-ace-pagination-options.dto';
import { UserPlayerAclService } from './user-player-acl.service';

@Controller('user-player-acl')
@ApiTags('user player ACL')
@UseGuards(AuthGuard, new RoleGuard(['ADMIN']))
@ApiCookieAuth()
export class UserPlayerAclController {
  constructor(
    private readonly aclService: UserPlayerAclService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(UserPlayerAceDto, { type: 'create' })
  @Serialize(UserPlayerAceDto)
  async create(
    @I18nLang() lang: string,
    @Body() createAceDto: CreateUserPlayerAceDto,
  ) {
    const accessControlEntry = await this.aclService.create(createAceDto);
    const message = this.i18n.translate('user-player-acl.CREATE_MESSAGE', {
      lang,
      args: {
        userName: `${accessControlEntry.user.firstName} ${accessControlEntry.user.lastName}`,
        playerName: `${accessControlEntry.player.firstName} ${accessControlEntry.player.lastName}`,
      },
    });
    return formatSuccessResponse(message, accessControlEntry);
  }

  @Get()
  @ApiPaginatedResponse(UserPlayerAceDto)
  @ApiQuery({ type: UserPlayerAcePaginationOptionsDto })
  @Serialize(UserPlayerAceDto, 'docs')
  async findAll(
    @I18nLang() lang: string,
    @PaginationOptions() paginationOptions: UserPlayerAcePaginationOptionsDto,
    @Query() query: FindAllUserPlayerAceDto,
  ) {
    const data = await this.aclService.findAll(paginationOptions, query);
    const message = this.i18n.translate('user-player-acl.GET_ALL_MESSAGE', {
      lang,
      args: {
        currentPage: data.page,
        totalPages: data.totalPages,
      },
    });
    return formatSuccessResponse(message, data);
  }

  @Get(':id')
  @ApiResponse(UserPlayerAceDto, { type: 'read' })
  @Serialize(UserPlayerAceDto)
  async findOne(@I18nLang() lang: string, @Param('id') id: number) {
    const accessControlEntry = await this.aclService.findOne(id);
    const message = this.i18n.translate('user-player-acl.GET_ONE_MESSAGE', {
      lang,
      args: {
        userName: `${accessControlEntry.user.firstName} ${accessControlEntry.user.lastName}`,
        playerName: `${accessControlEntry.player.firstName} ${accessControlEntry.player.lastName}`,
      },
    });
    return formatSuccessResponse(message, accessControlEntry);
  }

  @Patch(':id')
  @ApiResponse(UserPlayerAceDto, { type: 'update' })
  @Serialize(UserPlayerAceDto)
  async update(
    @I18nLang() lang: string,
    @Param('id') id: number,
    @Body() updateAceDto: UpdateUserPlayerAceDto,
  ) {
    const accessControlEntry = await this.aclService.update(id, updateAceDto);
    const message = this.i18n.translate('user-player-acl.UPDATE_MESSAGE', {
      lang,
      args: {
        userName: `${accessControlEntry.user.firstName} ${accessControlEntry.user.lastName}`,
        playerName: `${accessControlEntry.player.firstName} ${accessControlEntry.player.lastName}`,
      },
    });
    return formatSuccessResponse(message, accessControlEntry);
  }

  @Delete(':id')
  @ApiResponse(UserPlayerAceDto, { type: 'delete' })
  @Serialize(UserPlayerAceDto)
  async remove(@I18nLang() lang: string, @Param('id') id: number) {
    const accessControlEntry = await this.aclService.remove(id);
    const message = this.i18n.translate('user-player-acl.DELETE_MESSAGE', {
      lang,
      args: {
        userName: `${accessControlEntry.user.firstName} ${accessControlEntry.user.lastName}`,
        playerName: `${accessControlEntry.player.firstName} ${accessControlEntry.player.lastName}`,
      },
    });
    return formatSuccessResponse(message, accessControlEntry);
  }
}
