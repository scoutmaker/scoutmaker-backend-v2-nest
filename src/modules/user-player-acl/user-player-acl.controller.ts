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

import { ApiPaginatedResponse } from '../../api-response/api-paginated-response.decorator';
import { ApiResponse } from '../../api-response/api-response.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { RoleGuard } from '../../guards/role.guard';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { PaginationOptions } from '../../pagination/pagination-options.decorator';
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
    const message = '';

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
    const accessControlEntries = await this.aclService.findAll(
      paginationOptions,
      query,
    );
    const message = '';

    return formatSuccessResponse(message, accessControlEntries);
  }

  @Patch(':id')
  @ApiResponse(UserPlayerAceDto, { type: 'update' })
  @Serialize(UserPlayerAceDto)
  async update(
    @I18nLang() lang: string,
    @Param('id') id: string,
    @Body() updateAceDto: UpdateUserPlayerAceDto,
  ) {
    const accessControlEntry = await this.aclService.update(id, updateAceDto);
    const message = '';

    return formatSuccessResponse(message, accessControlEntry);
  }

  @Get(':id')
  @ApiResponse(UserPlayerAceDto, { type: 'read' })
  @Serialize(UserPlayerAceDto)
  async findOne(@I18nLang() lang: string, @Param('id') id: string) {
    const accessControlEntry = await this.aclService.findOne(id);
    const message = '';

    return formatSuccessResponse(message, accessControlEntry);
  }

  @Delete(':id')
  @ApiResponse(UserPlayerAceDto, { type: 'delete' })
  @Serialize(UserPlayerAceDto)
  async remove(@I18nLang() lang: string, @Param('id') id: string) {
    const accessControlEntry = await this.aclService.remove(id);

    const message = '';

    return formatSuccessResponse(message, accessControlEntry);
  }
}
