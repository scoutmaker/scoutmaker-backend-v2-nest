import {
  Body,
  Controller,
  Delete,
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
import { CreatePlayerRoleExampleDto } from './dto/create-player-role-example.dto';
import { FindAllPlayerRoleExamplesDto } from './dto/find-all-player-role-examples.dto';
import { PlayerRoleExampleDto } from './dto/player-role-example.dto';
import { PlayerRoleExamplesPaginationOptionsDto } from './dto/player-role-examples-pagination-options.dto';
import { UpdatePlayerRoleExampleDto } from './dto/update-player-role-example.dto';
import { PlayerRoleExamplesService } from './player-role-examples.service';

@Controller('player-role-examples')
@ApiTags('player role examples')
@UseGuards(AuthGuard)
@ApiSecurity('auth-token')
export class PlayerRoleExamplesController {
  constructor(
    private readonly examplesService: PlayerRoleExamplesService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @UseGuards(new RoleGuard(['ADMIN']))
  @ApiResponse(PlayerRoleExampleDto, { type: 'create' })
  @Serialize(PlayerRoleExampleDto)
  async create(
    @I18nLang() lang: string,
    @Body() createPlayerRoleExampleDto: CreatePlayerRoleExampleDto,
  ) {
    const example = await this.examplesService.create(
      createPlayerRoleExampleDto,
    );
    const message = this.i18n.translate('player-role-examples.CREATE_MESSAGE', {
      lang,
      args: { name: example.player },
    });
    return formatSuccessResponse(message, example);
  }

  @Post('upload')
  @UseGuards(new RoleGuard(['ADMIN']))
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
    const { createdCount, csvRowsCount, errors } =
      await this.examplesService.createManyFromCsv(file);
    return formatSuccessResponse('Success!', {
      csvRowsCount,
      createdCount,
      errors,
    });
  }

  @Get()
  @UseGuards(new RoleGuard(['ADMIN']))
  @ApiPaginatedResponse(PlayerRoleExampleDto)
  @ApiQuery({ type: PlayerRoleExamplesPaginationOptionsDto })
  @Serialize(PlayerRoleExampleDto, 'docs')
  async findAll(
    @I18nLang() lang: string,
    @PaginationOptions()
    paginationOptions: PlayerRoleExamplesPaginationOptionsDto,
    @Query() query: FindAllPlayerRoleExamplesDto,
  ) {
    const data = await this.examplesService.findAll(paginationOptions, query);
    const message = this.i18n.translate(
      'player-role-examples.GET_ALL_MESSAGE',
      {
        lang,
        args: { currentPage: data.page, totalPages: data.totalPages },
      },
    );
    return formatSuccessResponse(message, data);
  }

  @Get('list')
  @ApiResponse(PlayerRoleExampleDto, { type: 'read', isArray: true })
  @Serialize(PlayerRoleExampleDto)
  async getList(@I18nLang() lang: string) {
    const examples = await this.examplesService.getList();
    const message = this.i18n.translate(
      'player-role-examples.GET_LIST_MESSAGE',
      {
        lang,
      },
    );
    return formatSuccessResponse(message, examples);
  }

  @Get(':id')
  @ApiResponse(PlayerRoleExampleDto, { type: 'read' })
  @Serialize(PlayerRoleExampleDto)
  async findOne(@I18nLang() lang: string, @Param('id') id: string) {
    const example = await this.examplesService.findOne(id);
    const message = this.i18n.translate(
      'player-role-examples.GET_ONE_MESSAGE',
      {
        lang,
        args: { name: example.player },
      },
    );
    return formatSuccessResponse(message, example);
  }

  @Patch(':id')
  @UseGuards(new RoleGuard(['ADMIN']))
  @ApiResponse(PlayerRoleExampleDto, { type: 'update' })
  @Serialize(PlayerRoleExampleDto)
  async update(
    @I18nLang() lang: string,
    @Param('id') id: string,
    @Body() updatePlayerRoleExampleDto: UpdatePlayerRoleExampleDto,
  ) {
    const role = await this.examplesService.update(
      id,
      updatePlayerRoleExampleDto,
    );
    const message = this.i18n.translate('player-role-examples.UPDATE_MESSAGE', {
      lang,
      args: { name: role.player },
    });
    return formatSuccessResponse(message, role);
  }

  @Delete(':id')
  @UseGuards(new RoleGuard(['ADMIN']))
  @ApiResponse(PlayerRoleExampleDto, { type: 'delete' })
  @Serialize(PlayerRoleExampleDto)
  async remove(@I18nLang() lang: string, @Param('id') id: string) {
    const example = await this.examplesService.remove(id);
    const message = this.i18n.translate('player-role-examples.DELETE_MESSAGE', {
      lang,
      args: { name: example.player },
    });
    return formatSuccessResponse(message, example);
  }
}
