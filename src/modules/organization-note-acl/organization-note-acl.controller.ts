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
import { RoleGuard } from '../../common/guards/role.guard';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { PaginationOptions } from '../../common/pagination/pagination-options.decorator';
import { formatSuccessResponse } from '../../utils/helpers';
import { CreateOrganizationNoteAceDto } from './dto/create-organization-note-ace.dto';
import { FindAllOrganizationNoteAceDto } from './dto/find-all-organization-note-ace.dto';
import { OrganizationNoteAceDto } from './dto/organization-note-ace.dto';
import { OrganizationNoteAcePaginationOptionsDto } from './dto/organization-note-ace-pagination-options.dto';
import { UpdateOrganizationNoteAceDto } from './dto/update-organization-note-ace.dto';
import { OrganizationNoteAclService } from './organization-note-acl.service';

@Controller('organization-note-acl')
@ApiTags('organization note ACL')
@UseGuards(AuthGuard, new RoleGuard(['ADMIN']))
@ApiCookieAuth()
export class OrganizationNoteAclController {
  constructor(
    private readonly aclService: OrganizationNoteAclService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(OrganizationNoteAceDto, { type: 'create' })
  @Serialize(OrganizationNoteAceDto)
  async create(
    @I18nLang() lang: string,
    @Body() createAceDto: CreateOrganizationNoteAceDto,
  ) {
    const accessControlEntry = await this.aclService.create(createAceDto);
    const message = this.i18n.translate(
      'organization-note-acl.CREATE_MESSAGE',
      {
        lang,
        args: {
          orgName: accessControlEntry.organization.name,
          docNumber: accessControlEntry.note.docNumber,
        },
      },
    );
    return formatSuccessResponse(message, accessControlEntry);
  }

  @Get()
  @ApiPaginatedResponse(OrganizationNoteAceDto)
  @ApiQuery({ type: OrganizationNoteAcePaginationOptionsDto })
  @Serialize(OrganizationNoteAceDto, 'docs')
  async findAll(
    @I18nLang() lang: string,
    @PaginationOptions()
    paginationOptions: OrganizationNoteAcePaginationOptionsDto,
    @Query() query: FindAllOrganizationNoteAceDto,
  ) {
    const data = await this.aclService.findAll(paginationOptions, query);
    const message = this.i18n.translate(
      'organization-note-acl.GET_ALL_MESSAGE',
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
  @ApiResponse(OrganizationNoteAceDto, { type: 'read' })
  @Serialize(OrganizationNoteAceDto)
  async findOne(
    @I18nLang() lang: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const accessControlEntry = await this.aclService.findOne(id);
    const message = this.i18n.translate(
      'organization-note-acl.GET_ONE_MESSAGE',
      {
        lang,
        args: {
          orgName: accessControlEntry.organization.name,
          docNumber: accessControlEntry.note.docNumber,
        },
      },
    );
    return formatSuccessResponse(message, accessControlEntry);
  }

  @Patch(':id')
  @ApiResponse(OrganizationNoteAceDto, { type: 'update' })
  @Serialize(OrganizationNoteAceDto)
  async update(
    @I18nLang() lang: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAceDto: UpdateOrganizationNoteAceDto,
  ) {
    const accessControlEntry = await this.aclService.update(id, updateAceDto);
    const message = this.i18n.translate(
      'organization-note-acl.UPDATE_MESSAGE',
      {
        lang,
        args: {
          orgName: accessControlEntry.organization.name,
          docNumber: accessControlEntry.note.docNumber,
        },
      },
    );
    return formatSuccessResponse(message, accessControlEntry);
  }

  @Delete(':id')
  @ApiResponse(OrganizationNoteAceDto, { type: 'delete' })
  @Serialize(OrganizationNoteAceDto)
  async remove(
    @I18nLang() lang: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const accessControlEntry = await this.aclService.remove(id);
    const message = this.i18n.translate(
      'organization-note-acl.DELETE_MESSAGE',
      {
        lang,
        args: {
          orgName: accessControlEntry.organization.name,
          docNumber: accessControlEntry.note.docNumber,
        },
      },
    );
    return formatSuccessResponse(message, accessControlEntry);
  }
}
