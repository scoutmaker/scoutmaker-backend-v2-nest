import {
  Body,
  Controller,
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
import { ChangeRoleDto } from './dto/change-user-role.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { FindAllUsersDto } from './dto/find-all-users.dto';
import { UserBasicDataDto, UserDto } from './dto/user.dto';
import { UsersPaginationOptionsDto } from './dto/users-pagination-options.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
@UseGuards(AuthGuard, new RoleGuard(['ADMIN']))
@ApiSecurity('auth-token')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(UserDto, { type: 'create' })
  @Serialize(UserDto)
  async create(@I18nLang() lang: string, @Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    const message = this.i18n.translate('users.CREATE_MESSAGE', {
      lang,
      args: { name: user.lastName },
    });
    return formatSuccessResponse(message, user);
  }

  @Post('upload')
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
    const { createdDocuments, errors } =
      await this.usersService.createManyFromCsv(file);
    return formatSuccessResponse('Success!', {
      createdCount: createdDocuments.length,
      createdDocuments,
      errors,
    });
  }

  @Get()
  @ApiPaginatedResponse(UserDto)
  @ApiQuery({ type: UsersPaginationOptionsDto })
  @Serialize(UserDto, 'docs')
  async findAll(
    @I18nLang() lang: string,
    @PaginationOptions() paginationOptions: UsersPaginationOptionsDto,
    @Query() query: FindAllUsersDto,
  ) {
    const data = await this.usersService.findAllWithPagination(
      paginationOptions,
      query,
    );
    const message = this.i18n.translate('users.GET_ALL_MESSAGE', {
      lang,
      args: { currentPage: data.page, totalPages: data.totalPages },
    });
    return formatSuccessResponse(message, data);
  }

  @Get('list')
  @ApiResponse(UserBasicDataDto, { type: 'read', isArray: true })
  @Serialize(UserBasicDataDto)
  async getList(@I18nLang() lang: string, @Query() query: FindAllUsersDto) {
    const users = await this.usersService.getList(query);
    const message = this.i18n.translate('users.GET_LIST_MESSAGE', {
      lang,
    });
    return formatSuccessResponse(message, users);
  }

  @Get(':id')
  @ApiResponse(UserDto, { type: 'read' })
  @Serialize(UserDto)
  async findOne(@I18nLang() lang: string, @Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    const message = this.i18n.translate('users.GET_ONE_MESSAGE', {
      lang,
      args: { name: `${user.firstName} ${user.lastName}` },
    });
    return formatSuccessResponse(message, user);
  }

  @Patch(':id/change-role')
  @ApiResponse(UserDto, { type: 'update' })
  @Serialize(UserDto)
  async changeRole(
    @I18nLang() lang: string,
    @Param('id') id: string,
    @Body() { role }: ChangeRoleDto,
  ) {
    const user = await this.usersService.changeRole(id, role);
    const message = this.i18n.translate('users.CHANGE_ROLE_MESSAGE', {
      lang,
      args: {
        userName: `${user.firstName} ${user.lastName}`,
        roleName: user.role,
      },
    });
    return formatSuccessResponse(message, user);
  }
}
