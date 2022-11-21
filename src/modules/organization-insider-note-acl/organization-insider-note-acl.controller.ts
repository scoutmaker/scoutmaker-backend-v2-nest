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
import { ApiSecurity, ApiQuery, ApiTags } from '@nestjs/swagger';
import { I18nLang, I18nService } from 'nestjs-i18n';

import { ApiPaginatedResponse } from '../../common/api-response/api-paginated-response.decorator';
import { ApiResponse } from '../../common/api-response/api-response.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { PaginationOptions } from '../../common/pagination/pagination-options.decorator';
import { formatSuccessResponse } from '../../utils/helpers';
import { CreateOrganizationInsiderNoteAceDto } from './dto/create-organization-insider-note-ace.dto';
import { FindAllOrganizationInsiderNoteAceDto } from './dto/find-all-organization-insider-note-ace.dto';
import { OrganizationInsiderNoteAceDto } from './dto/organization-insider-note-ace.dto';
import { OrganizationInsiderNoteAcePaginationOptionsDto } from './dto/organization-insider-note-ace-pagination-options.dto';
import { UpdateOrganizationInsiderNoteAceDto } from './dto/update-organization-insider-note-ace.dto';
import { OrganizationInsiderNoteAclService } from './organization-insider-note-acl.service';

@Controller('organization-insider-note-acl')
@ApiTags('organization insider note ACL')
@UseGuards(AuthGuard, new RoleGuard(['ADMIN']))
@ApiSecurity('auth-token')
export class OrganizationInsiderNoteAclController {
  constructor(
    private readonly aclService: OrganizationInsiderNoteAclService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(OrganizationInsiderNoteAceDto, { type: 'create' })
  @Serialize(OrganizationInsiderNoteAceDto)
  async create(
    @I18nLang() lang: string,
    @Body() createAceDto: CreateOrganizationInsiderNoteAceDto,
  ) {
    const accessControlEntry = await this.aclService.create(createAceDto);
    const message = this.i18n.translate(
      'organization-insider-note-acl.CREATE_MESSAGE',
      {
        lang,
        args: {
          orgName: accessControlEntry.organization.name,
          docNumber: accessControlEntry.insiderNote.docNumber,
        },
      },
    );
    return formatSuccessResponse(message, accessControlEntry);
  }

  @Get()
  @ApiPaginatedResponse(OrganizationInsiderNoteAceDto)
  @ApiQuery({ type: OrganizationInsiderNoteAcePaginationOptionsDto })
  @Serialize(OrganizationInsiderNoteAceDto, 'docs')
  async findAll(
    @I18nLang() lang: string,
    @PaginationOptions()
    paginationOptions: OrganizationInsiderNoteAcePaginationOptionsDto,
    @Query() query: FindAllOrganizationInsiderNoteAceDto,
  ) {
    const data = await this.aclService.findAll(paginationOptions, query);
    const message = this.i18n.translate(
      'organization-insider-note-acl.GET_ALL_MESSAGE',
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
  @ApiResponse(OrganizationInsiderNoteAceDto, { type: 'read' })
  @Serialize(OrganizationInsiderNoteAceDto)
  async findOne(@I18nLang() lang: string, @Param('id') id: string) {
    const accessControlEntry = await this.aclService.findOne(id);
    const message = this.i18n.translate(
      'organization-insider-note-acl.GET_ONE_MESSAGE',
      {
        lang,
        args: {
          orgName: accessControlEntry.organization.name,
          docNumber: accessControlEntry.insiderNote.docNumber,
        },
      },
    );
    return formatSuccessResponse(message, accessControlEntry);
  }

  @Patch(':id')
  @ApiResponse(OrganizationInsiderNoteAceDto, { type: 'update' })
  @Serialize(OrganizationInsiderNoteAceDto)
  async update(
    @I18nLang() lang: string,
    @Param('id') id: string,
    @Body() updateAceDto: UpdateOrganizationInsiderNoteAceDto,
  ) {
    const accessControlEntry = await this.aclService.update(id, updateAceDto);
    const message = this.i18n.translate(
      'organization-insider-note-acl.UPDATE_MESSAGE',
      {
        lang,
        args: {
          orgName: accessControlEntry.organization.name,
          docNumber: accessControlEntry.insiderNote.docNumber,
        },
      },
    );
    return formatSuccessResponse(message, accessControlEntry);
  }

  @Delete(':id')
  @ApiResponse(OrganizationInsiderNoteAceDto, { type: 'delete' })
  @Serialize(OrganizationInsiderNoteAceDto)
  async remove(@I18nLang() lang: string, @Param('id') id: string) {
    const accessControlEntry = await this.aclService.remove(id);
    const message = this.i18n.translate(
      'organization-insider-note-acl.DELETE_MESSAGE',
      {
        lang,
        args: {
          orgName: accessControlEntry.organization.name,
          docNumber: accessControlEntry.insiderNote.docNumber,
        },
      },
    );
    return formatSuccessResponse(message, accessControlEntry);
  }
}
