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
import { ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { I18nLang, I18nService } from 'nestjs-i18n';

import { ApiPaginatedResponse } from '../../common/api-response/api-paginated-response.decorator';
import { ApiResponse } from '../../common/api-response/api-response.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { PaginationOptions } from '../../common/pagination/pagination-options.decorator';
import { formatSuccessResponse } from '../../utils/helpers';
import { CreateOrganizationPlayerAceDto } from './dto/create-organization-player-ace.dto';
import { FindAllOrganizationPlayerAceDto } from './dto/find-all-organization-player-ace.dto';
import { OrganizationPlayerAceDto } from './dto/organization-player-ace.dto';
import { OrganizationPlayerAcePaginationOptionsDto } from './dto/organization-player-ace-pagination-options.dto';
import { UpdateOrganizationPlayerAceDto } from './dto/update-organization-player-ace.dto';
import { OrganizationPlayerAclService } from './organization-player-acl.service';

@Controller('organization-player-acl')
@ApiTags('organization player ACL')
@UseGuards(AuthGuard, new RoleGuard(['ADMIN']))
@ApiSecurity('auth-token')
export class OrganizationPlayerAclController {
  constructor(
    private readonly aclService: OrganizationPlayerAclService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(OrganizationPlayerAceDto, { type: 'create' })
  @Serialize(OrganizationPlayerAceDto)
  async create(
    @I18nLang() lang: string,
    @Body() createAceDto: CreateOrganizationPlayerAceDto,
  ) {
    const accessControlEntry = await this.aclService.create(createAceDto);
    const message = this.i18n.translate(
      'organization-player-acl.CREATE_MESSAGE',
      {
        lang,
        args: {
          orgName: accessControlEntry.organization.name,
          playerName: `${accessControlEntry.player.firstName} ${accessControlEntry.player.lastName}`,
        },
      },
    );
    return formatSuccessResponse(message, accessControlEntry);
  }

  @Get()
  @ApiPaginatedResponse(OrganizationPlayerAceDto)
  @ApiQuery({ type: OrganizationPlayerAcePaginationOptionsDto })
  @Serialize(OrganizationPlayerAceDto, 'docs')
  async findAll(
    @I18nLang() lang: string,
    @PaginationOptions()
    paginationOptions: OrganizationPlayerAcePaginationOptionsDto,
    @Query() query: FindAllOrganizationPlayerAceDto,
  ) {
    const data = await this.aclService.findAll(paginationOptions, query);
    const message = this.i18n.translate(
      'organization-player-acl.GET_ALL_MESSAGE',
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
  @ApiResponse(OrganizationPlayerAceDto, { type: 'read' })
  @Serialize(OrganizationPlayerAceDto)
  async findOne(@I18nLang() lang: string, @Param('id') id: string) {
    const accessControlEntry = await this.aclService.findOne(id);
    const message = this.i18n.translate(
      'organization-player-acl.GET_ONE_MESSAGE',
      {
        lang,
        args: {
          orgName: accessControlEntry.organization.name,
          playerName: `${accessControlEntry.player.firstName} ${accessControlEntry.player.lastName}`,
        },
      },
    );
    return formatSuccessResponse(message, accessControlEntry);
  }

  @Patch(':id')
  @ApiResponse(OrganizationPlayerAceDto, { type: 'update' })
  @Serialize(OrganizationPlayerAceDto)
  async update(
    @I18nLang() lang: string,
    @Param('id') id: string,
    @Body() updateAceDto: UpdateOrganizationPlayerAceDto,
  ) {
    const accessControlEntry = await this.aclService.update(id, updateAceDto);
    const message = this.i18n.translate(
      'organization-player-acl.UPDATE_MESSAGE',
      {
        lang,
        args: {
          orgName: accessControlEntry.organization.name,
          playerName: `${accessControlEntry.player.firstName} ${accessControlEntry.player.lastName}`,
        },
      },
    );
    return formatSuccessResponse(message, accessControlEntry);
  }

  @Delete(':id')
  @ApiResponse(OrganizationPlayerAceDto, { type: 'delete' })
  @Serialize(OrganizationPlayerAceDto)
  async remove(@I18nLang() lang: string, @Param('id') id: string) {
    const accessControlEntry = await this.aclService.remove(id);
    const message = this.i18n.translate(
      'organization-player-acl.DELETE_MESSAGE',
      {
        lang,
        args: {
          orgName: accessControlEntry.organization.name,
          playerName: `${accessControlEntry.player.firstName} ${accessControlEntry.player.lastName}`,
        },
      },
    );
    return formatSuccessResponse(message, accessControlEntry);
  }
}
