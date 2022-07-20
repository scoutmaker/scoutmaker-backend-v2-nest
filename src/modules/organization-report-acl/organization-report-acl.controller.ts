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
import { CreateOrganizationReportAceDto } from './dto/create-organization-report-ace.dto';
import { FindAllOrganizationReportAceDto } from './dto/find-all-organization-report-ace.dto';
import { OrganizationReportAceDto } from './dto/organization-report-ace.dto';
import { OrganizationReportAcePaginationOptionsDto } from './dto/organization-report-ace-pagination-options.dto';
import { UpdateOrganizationReportAceDto } from './dto/update-organization-report-ace.dto';
import { OrganizationReportAclService } from './organization-report-acl.service';

@Controller('organization-report-acl')
@ApiTags('organization report ACL')
@UseGuards(AuthGuard, new RoleGuard(['ADMIN']))
@ApiCookieAuth()
export class OrganizationReportAclController {
  constructor(
    private readonly aclService: OrganizationReportAclService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(OrganizationReportAceDto, { type: 'create' })
  @Serialize(OrganizationReportAceDto)
  async create(
    @I18nLang() lang: string,
    @Body() createAceDto: CreateOrganizationReportAceDto,
  ) {
    const accessControlEntry = await this.aclService.create(createAceDto);
    const message = this.i18n.translate(
      'organization-report-acl.CREATE_MESSAGE',
      {
        lang,
        args: {
          orgName: accessControlEntry.organization.name,
          docNumber: accessControlEntry.report.id,
        },
      },
    );
    return formatSuccessResponse(message, accessControlEntry);
  }

  @Get()
  @ApiPaginatedResponse(OrganizationReportAceDto)
  @ApiQuery({ type: OrganizationReportAcePaginationOptionsDto })
  @Serialize(OrganizationReportAceDto, 'docs')
  async findAll(
    @I18nLang() lang: string,
    @PaginationOptions()
    paginationOptions: OrganizationReportAcePaginationOptionsDto,
    @Query() query: FindAllOrganizationReportAceDto,
  ) {
    const data = await this.aclService.findAll(paginationOptions, query);
    const message = this.i18n.translate(
      'organization-report-acl.GET_ALL_MESSAGE',
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
  @ApiResponse(OrganizationReportAceDto, { type: 'read' })
  @Serialize(OrganizationReportAceDto)
  async findOne(@I18nLang() lang: string, @Param('id') id: number) {
    const accessControlEntry = await this.aclService.findOne(id);
    const message = this.i18n.translate(
      'organization-report-acl.GET_ONE_MESSAGE',
      {
        lang,
        args: {
          orgName: accessControlEntry.organization.name,
          docNumber: accessControlEntry.report.id,
        },
      },
    );
    return formatSuccessResponse(message, accessControlEntry);
  }

  @Patch(':id')
  @ApiResponse(OrganizationReportAceDto, { type: 'update' })
  @Serialize(OrganizationReportAceDto)
  async update(
    @I18nLang() lang: string,
    @Param('id') id: number,
    @Body() updateAceDto: UpdateOrganizationReportAceDto,
  ) {
    const accessControlEntry = await this.aclService.update(id, updateAceDto);
    const message = this.i18n.translate(
      'organization-report-acl.UPDATE_MESSAGE',
      {
        lang,
        args: {
          orgName: accessControlEntry.organization.name,
          docNumber: accessControlEntry.report.id,
        },
      },
    );
    return formatSuccessResponse(message, accessControlEntry);
  }

  @Delete(':id')
  @ApiResponse(OrganizationReportAceDto, { type: 'delete' })
  @Serialize(OrganizationReportAceDto)
  async remove(@I18nLang() lang: string, @Param('id') id: number) {
    const accessControlEntry = await this.aclService.remove(id);
    const message = this.i18n.translate(
      'organization-report-acl.DELETE_MESSAGE',
      {
        lang,
        args: {
          orgName: accessControlEntry.organization.name,
          docNumber: accessControlEntry.report.id,
        },
      },
    );
    return formatSuccessResponse(message, accessControlEntry);
  }
}
