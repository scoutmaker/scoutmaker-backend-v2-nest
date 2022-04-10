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
import { CreateUserNoteAceDto } from './dto/create-user-note-ace.dto';
import { FindAllUserNoteAceDto } from './dto/find-all-user-note-ace.dto';
import { UpdateUserNoteAceDto } from './dto/update-user-note-ace.dto';
import { UserNoteAceDto } from './dto/user-note-ace.dto';
import { UserNoteAcePaginationOptionsDto } from './dto/user-note-ace-pagination-options.dto';
import { UserNoteAclService } from './user-note-acl.service';

@Controller('user-note-acl')
@ApiTags('user note ACL')
@UseGuards(AuthGuard, new RoleGuard(['ADMIN']))
@ApiCookieAuth()
export class UserNoteAclController {
  constructor(
    private readonly aclService: UserNoteAclService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(UserNoteAceDto, { type: 'create' })
  @Serialize(UserNoteAceDto)
  async create(
    @I18nLang() lang: string,
    @Body() createAceDto: CreateUserNoteAceDto,
  ) {
    const accessControlEntry = await this.aclService.create(createAceDto);
    const message = await this.i18n.translate('user-note-acl.CREATE_MESSAGE', {
      lang,
      args: {
        userName: `${accessControlEntry.user.firstName} ${accessControlEntry.user.lastName}`,
        docNumber: accessControlEntry.note.docNumber,
      },
    });
    return formatSuccessResponse(message, accessControlEntry);
  }

  @Get()
  @ApiPaginatedResponse(UserNoteAceDto)
  @ApiQuery({ type: UserNoteAcePaginationOptionsDto })
  @Serialize(UserNoteAceDto, 'docs')
  async findAll(
    @I18nLang() lang: string,
    @PaginationOptions() paginationOptions: UserNoteAcePaginationOptionsDto,
    @Query() query: FindAllUserNoteAceDto,
  ) {
    const data = await this.aclService.findAll(paginationOptions, query);
    const message = await this.i18n.translate('user-note-acl.GET_ALL_MESSAGE', {
      lang,
      args: {
        currentPage: data.page,
        totalPages: data.totalPages,
      },
    });
    return formatSuccessResponse(message, data);
  }

  @Get(':id')
  @ApiResponse(UserNoteAceDto, { type: 'read' })
  @Serialize(UserNoteAceDto)
  async findOne(@I18nLang() lang: string, @Param('id') id: string) {
    const accessControlEntry = await this.aclService.findOne(id);
    const message = await this.i18n.translate('user-note-acl.GET_ONE_MESSAGE', {
      lang,
      args: {
        userName: `${accessControlEntry.user.firstName} ${accessControlEntry.user.lastName}`,
        docNumber: accessControlEntry.note.docNumber,
      },
    });
    return formatSuccessResponse(message, accessControlEntry);
  }

  @Patch(':id')
  @ApiResponse(UserNoteAceDto, { type: 'update' })
  @Serialize(UserNoteAceDto)
  async update(
    @I18nLang() lang: string,
    @Param('id') id: string,
    @Body() updateAceDto: UpdateUserNoteAceDto,
  ) {
    const accessControlEntry = await this.aclService.update(id, updateAceDto);
    const message = await this.i18n.translate('user-note-acl.UPDATE_MESSAGE', {
      lang,
      args: {
        userName: `${accessControlEntry.user.firstName} ${accessControlEntry.user.lastName}`,
        docNumber: accessControlEntry.note.docNumber,
      },
    });
    return formatSuccessResponse(message, accessControlEntry);
  }

  @Delete(':id')
  @ApiResponse(UserNoteAceDto, { type: 'delete' })
  @Serialize(UserNoteAceDto)
  async remove(@I18nLang() lang: string, @Param('id') id: string) {
    const accessControlEntry = await this.aclService.remove(id);
    const message = await this.i18n.translate('user-note-acl.DELETE_MESSAGE', {
      lang,
      args: {
        userName: `${accessControlEntry.user.firstName} ${accessControlEntry.user.lastName}`,
        docNumber: accessControlEntry.note.docNumber,
      },
    });
    return formatSuccessResponse(message, accessControlEntry);
  }
}
