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
import { CreateUserInsiderNoteAceDto } from './dto/create-user-insider-note-ace.dto';
import { FindAllUserInsiderNoteAceDto } from './dto/find-all-user-insider-note-ace.dto';
import { UpdateUserInsiderNoteAceDto } from './dto/update-user-insider-note-ace.dto';
import { UserInsiderNoteAceDto } from './dto/user-insider-note-ace.dto';
import { UserInsiderNoteAcePaginationOptionsDto } from './dto/user-insider-note-ace-pagination-options.dto';
import { UserInsiderNoteAclService } from './user-insider-note-acl.service';

@Controller('user-insider-note-acl')
@ApiTags('user insider note ACL')
@UseGuards(AuthGuard, new RoleGuard(['ADMIN']))
@ApiCookieAuth()
export class UserInsiderNoteAclController {
  constructor(
    private readonly aclService: UserInsiderNoteAclService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(UserInsiderNoteAceDto, { type: 'create' })
  @Serialize(UserInsiderNoteAceDto)
  async create(
    @I18nLang() lang: string,
    @Body() createAceDto: CreateUserInsiderNoteAceDto,
  ) {
    const accessControlEntry = await this.aclService.create(createAceDto);
    const message = this.i18n.translate(
      'user-insider-note-acl.CREATE_MESSAGE',
      {
        lang,
        args: {
          userName: `${accessControlEntry.user.firstName} ${accessControlEntry.user.lastName}`,
          docNumber: accessControlEntry.insiderNote.docNumber,
        },
      },
    );
    return formatSuccessResponse(message, accessControlEntry);
  }

  @Get()
  @ApiPaginatedResponse(UserInsiderNoteAceDto)
  @ApiQuery({ type: UserInsiderNoteAcePaginationOptionsDto })
  @Serialize(UserInsiderNoteAceDto, 'docs')
  async findAll(
    @I18nLang() lang: string,
    @PaginationOptions()
    paginationOptions: UserInsiderNoteAcePaginationOptionsDto,
    @Query() query: FindAllUserInsiderNoteAceDto,
  ) {
    const data = await this.aclService.findAll(paginationOptions, query);
    const message = this.i18n.translate(
      'user-insider-note-acl.GET_ALL_MESSAGE',
      {
        lang,
        args: {
          currentPage: data.page,
          totalPages: data.totalPages,
        },
      },
    );
    return formatSuccessResponse(message, data);
  }

  @Get(':id')
  @ApiResponse(UserInsiderNoteAceDto, { type: 'read' })
  @Serialize(UserInsiderNoteAceDto)
  async findOne(@I18nLang() lang: string, @Param('id') id: string) {
    const accessControlEntry = await this.aclService.findOne(id);
    const message = this.i18n.translate(
      'user-insider-note-acl.GET_ONE_MESSAGE',
      {
        lang,
        args: {
          userName: `${accessControlEntry.user.firstName} ${accessControlEntry.user.lastName}`,
          docNumber: accessControlEntry.insiderNote.docNumber,
        },
      },
    );
    return formatSuccessResponse(message, accessControlEntry);
  }

  @Patch(':id')
  @ApiResponse(UserInsiderNoteAceDto, { type: 'update' })
  @Serialize(UserInsiderNoteAceDto)
  async update(
    @I18nLang() lang: string,
    @Param('id') id: string,
    @Body() updateAceDto: UpdateUserInsiderNoteAceDto,
  ) {
    const accessControlEntry = await this.aclService.update(id, updateAceDto);
    const message = this.i18n.translate(
      'user-insider-note-acl.UPDATE_MESSAGE',
      {
        lang,
        args: {
          userName: `${accessControlEntry.user.firstName} ${accessControlEntry.user.lastName}`,
          docNumber: accessControlEntry.insiderNote.docNumber,
        },
      },
    );
    return formatSuccessResponse(message, accessControlEntry);
  }

  @Delete(':id')
  @ApiResponse(UserInsiderNoteAceDto, { type: 'delete' })
  @Serialize(UserInsiderNoteAceDto)
  async remove(@I18nLang() lang: string, @Param('id') id: string) {
    const accessControlEntry = await this.aclService.remove(id);
    const message = this.i18n.translate(
      'user-insider-note-acl.DELETE_MESSAGE',
      {
        lang,
        args: {
          userName: `${accessControlEntry.user.firstName} ${accessControlEntry.user.lastName}`,
          docNumber: accessControlEntry.insiderNote.docNumber,
        },
      },
    );
    return formatSuccessResponse(message, accessControlEntry);
  }
}
