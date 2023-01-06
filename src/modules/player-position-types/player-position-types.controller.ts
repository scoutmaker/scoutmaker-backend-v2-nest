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
import { CreatePlayerPositionTypeDto } from './dto/create-player-position-type.dto';
import { FindAllPlayerPositionTypesDto } from './dto/find-all-player-position-types.dto';
import { PlayerPositionTypeDto } from './dto/player-position-type.dto';
import { PlayerPositionTypesPaginationOptionsDto } from './dto/player-position-types-pagination-options.dto';
import { UpdatePlayerPositionTypeDto } from './dto/update-player-position-type.dto';
import { PlayerPositionTypesService } from './player-position-types.service';

@Controller('player-position-types')
@ApiTags('player position types')
@UseGuards(AuthGuard)
@ApiSecurity('auth-token')
export class PlayerPositionTypesController {
  constructor(
    private readonly positionTypesService: PlayerPositionTypesService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @UseGuards(new RoleGuard(['ADMIN']))
  @ApiResponse(PlayerPositionTypeDto, { type: 'create' })
  @Serialize(PlayerPositionTypeDto)
  async create(
    @I18nLang() lang: string,
    @Body() createPlayerPositionTypeDto: CreatePlayerPositionTypeDto,
  ) {
    const position = await this.positionTypesService.create(
      createPlayerPositionTypeDto,
    );
    const message = this.i18n.translate(
      'player-position-types.CREATE_MESSAGE',
      {
        lang,
        args: { name: position.name },
      },
    );
    return formatSuccessResponse(message, position);
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
      await this.positionTypesService.createManyFromCsv(file);
    return formatSuccessResponse('Success!', {
      csvRowsCount,
      createdCount,
      errors,
    });
  }

  @Get()
  @ApiPaginatedResponse(PlayerPositionTypeDto)
  @ApiQuery({ type: PlayerPositionTypesPaginationOptionsDto })
  @Serialize(PlayerPositionTypeDto, 'docs')
  async findAll(
    @I18nLang() lang: string,
    @PaginationOptions()
    paginationOptions: PlayerPositionTypesPaginationOptionsDto,
    @Query() query: FindAllPlayerPositionTypesDto,
  ) {
    const data = await this.positionTypesService.findAll(
      paginationOptions,
      query,
    );
    const message = this.i18n.translate(
      'player-position-types.GET_ALL_MESSAGE',
      {
        lang,
        args: { currentPage: data.page, totalPages: data.totalPages },
      },
    );
    return formatSuccessResponse(message, data);
  }

  @Get('list')
  @ApiResponse(PlayerPositionTypeDto, { type: 'read', isArray: true })
  @Serialize(PlayerPositionTypeDto)
  async getList(@I18nLang() lang: string) {
    const positionTypes = await this.positionTypesService.getList();
    const message = this.i18n.translate(
      'player-position-types.GET_LIST_MESSAGE',
      {
        lang,
      },
    );
    return formatSuccessResponse(message, positionTypes);
  }

  @Get(':id')
  @ApiResponse(PlayerPositionTypeDto, { type: 'read' })
  @Serialize(PlayerPositionTypeDto)
  async findOne(@I18nLang() lang: string, @Param('id') id: string) {
    const positionType = await this.positionTypesService.findOne(id);
    const message = this.i18n.translate(
      'player-position-types.GET_ONE_MESSAGE',
      {
        lang,
        args: { name: positionType.name },
      },
    );
    return formatSuccessResponse(message, positionType);
  }

  @Patch(':id')
  @UseGuards(new RoleGuard(['ADMIN']))
  @ApiResponse(PlayerPositionTypeDto, { type: 'update' })
  @Serialize(PlayerPositionTypeDto)
  async update(
    @I18nLang() lang: string,
    @Param('id') id: string,
    @Body() updatePlayerPositionTypeDto: UpdatePlayerPositionTypeDto,
  ) {
    const positionType = await this.positionTypesService.update(
      id,
      updatePlayerPositionTypeDto,
    );
    const message = this.i18n.translate(
      'player-position-types.UPDATE_MESSAGE',
      {
        lang,
        args: { name: positionType.name },
      },
    );
    return formatSuccessResponse(message, positionType);
  }

  @Delete(':id')
  @UseGuards(new RoleGuard(['ADMIN']))
  @ApiResponse(PlayerPositionTypeDto, { type: 'delete' })
  @Serialize(PlayerPositionTypeDto)
  async remove(@I18nLang() lang: string, @Param('id') id: string) {
    const position = await this.positionTypesService.remove(id);
    const message = this.i18n.translate(
      'player-position-types.DELETE_MESSAGE',
      {
        lang,
        args: { name: position.name },
      },
    );
    return formatSuccessResponse(message, position);
  }
}
