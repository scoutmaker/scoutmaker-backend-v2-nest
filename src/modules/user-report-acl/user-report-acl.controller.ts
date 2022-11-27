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
import { CreateUserReportAceDto } from './dto/create-user-report-ace.dto';
import { FindAllUserReportAceDto } from './dto/find-all-user-report-ace.dto';
import { UpdateUserReportAceDto } from './dto/update-user-report-ace.dto';
import { UserReportAceDto } from './dto/user-report-ace.dto';
import { UserReportAcePaginationOptionsDto } from './dto/user-report-ace-pagination-options.dto';
import { UserReportAclService } from './user-report-acl.service';

@Controller('user-report-acl')
@ApiTags('user report ACL')
@UseGuards(AuthGuard, new RoleGuard(['ADMIN']))
@ApiSecurity('auth-token')
export class UserReportAclController {
  constructor(
    private readonly aclService: UserReportAclService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(UserReportAceDto, { type: 'create' })
  @Serialize(UserReportAceDto)
  async create(
    @I18nLang() lang: string,
    @Body() createAceDto: CreateUserReportAceDto,
  ) {
    const accessControlEntry = await this.aclService.create(createAceDto);
    const message = this.i18n.translate('user-report-acl.CREATE_MESSAGE', {
      lang,
      args: {
        userName: `${accessControlEntry.user.firstName} ${accessControlEntry.user.lastName}`,
        docNumber: accessControlEntry.report.docNumber,
      },
    });
    return formatSuccessResponse(message, accessControlEntry);
  }

  @Get()
  @ApiPaginatedResponse(UserReportAceDto)
  @ApiQuery({ type: UserReportAcePaginationOptionsDto })
  @Serialize(UserReportAceDto, 'docs')
  async findAll(
    @I18nLang() lang: string,
    @PaginationOptions() paginationOptions: UserReportAcePaginationOptionsDto,
    @Query() query: FindAllUserReportAceDto,
  ) {
    const data = await this.aclService.findAll(paginationOptions, query);
    const message = this.i18n.translate('user-report-acl.GET_ALL_MESSAGE', {
      lang,
      args: {
        currentPage: data.page,
        totalPages: data.totalPages,
      },
    });
    return formatSuccessResponse(message, data);
  }

  @Get(':id')
  @ApiResponse(UserReportAceDto, { type: 'read' })
  @Serialize(UserReportAceDto)
  async findOne(@I18nLang() lang: string, @Param('id') id: string) {
    const accessControlEntry = await this.aclService.findOne(id);
    const message = this.i18n.translate('user-report-acl.GET_ONE_MESSAGE', {
      lang,
      args: {
        userName: `${accessControlEntry.user.firstName} ${accessControlEntry.user.lastName}`,
        docNumber: accessControlEntry.report.docNumber,
      },
    });
    return formatSuccessResponse(message, accessControlEntry);
  }

  @Patch(':id')
  @ApiResponse(UserReportAceDto, { type: 'update' })
  @Serialize(UserReportAceDto)
  async update(
    @I18nLang() lang: string,
    @Param('id') id: string,
    @Body() updateAceDto: UpdateUserReportAceDto,
  ) {
    const accessControlEntry = await this.aclService.update(id, updateAceDto);
    const message = this.i18n.translate('user-report-acl.UPDATE_MESSAGE', {
      lang,
      args: {
        userName: `${accessControlEntry.user.firstName} ${accessControlEntry.user.lastName}`,
        docNumber: accessControlEntry.report.docNumber,
      },
    });
    return formatSuccessResponse(message, accessControlEntry);
  }

  @Delete(':id')
  @ApiResponse(UserReportAceDto, { type: 'delete' })
  @Serialize(UserReportAceDto)
  async remove(@I18nLang() lang: string, @Param('id') id: string) {
    const accessControlEntry = await this.aclService.remove(id);
    const message = this.i18n.translate('user-report-acl.DELETE_MESSAGE', {
      lang,
      args: {
        userName: `${accessControlEntry.user.firstName} ${accessControlEntry.user.lastName}`,
        docNumber: accessControlEntry.report.docNumber,
      },
    });
    return formatSuccessResponse(message, accessControlEntry);
  }
}
