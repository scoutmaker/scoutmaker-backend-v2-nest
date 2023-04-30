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
import { Prisma } from '@prisma/client';
import { I18nLang, I18nService } from 'nestjs-i18n';

import { AccessFilters } from '../../common/access-filters/access-filters.decorator';
import { ApiPaginatedResponse } from '../../common/api-response/api-paginated-response.decorator';
import { ApiResponse } from '../../common/api-response/api-response.decorator';
import { AdminOrAuthorGuard } from '../../common/guards/admin-or-author.guard';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { PaginationOptions } from '../../common/pagination/pagination-options.decorator';
import { formatSuccessResponse } from '../../utils/helpers';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { CurrentUserDto } from '../users/dto/current-user.dto';
import { CreatePlayerDto } from './dto/create-player.dto';
import { FindAllPlayersDto } from './dto/find-all-players.dto';
import { PlayerBasicDataDto, PlayerDto } from './dto/player.dto';
import { PlayersPaginationOptionsDto } from './dto/players-pagination-options.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { ReadGuard } from './guards/read.guard';
import { AccessFiltersInterceptor } from './interceptors/access-filters.interceptor';
import { PlayersService } from './players.service';

@Controller('players')
@ApiTags('players')
@UseGuards(AuthGuard)
@ApiSecurity('auth-token')
export class PlayersController {
  constructor(
    private readonly playersService: PlayersService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(PlayerDto, { type: 'create' })
  @Serialize(PlayerDto)
  async create(
    @I18nLang() lang: string,
    @Body() createPlayerDto: CreatePlayerDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const player = await this.playersService.create(
      createPlayerDto,
      user.id,
      user.role,
    );
    const message = this.i18n.translate('players.CREATE_MESSAGE', {
      lang,
      args: { name: `${player.firstName} ${player.lastName}` },
    });
    return formatSuccessResponse(message, player);
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
      await this.playersService.createManyFromCsv(file);
    return formatSuccessResponse('Success!', {
      csvRowsCount,
      createdCount,
      errors,
    });
  }

  @Get()
  @UseInterceptors(AccessFiltersInterceptor)
  @ApiPaginatedResponse(PlayerDto)
  @ApiQuery({ type: PlayersPaginationOptionsDto })
  @Serialize(PlayerDto, 'docs')
  async findAll(
    @I18nLang() lang: string,
    @CurrentUser() user: CurrentUserDto,
    @PaginationOptions() paginationOptions: PlayersPaginationOptionsDto,
    @AccessFilters() accessFilters: Prisma.PlayerWhereInput,
    @Query() query: FindAllPlayersDto,
  ) {
    const data = await this.playersService.findAll(
      paginationOptions,
      query,
      user.id,
      accessFilters,
    );
    const message = this.i18n.translate('players.GET_ALL_MESSAGE', {
      lang,
      args: { currentPage: data.page, totalPages: data.totalPages },
    });
    return formatSuccessResponse(message, data);
  }

  @Get('list')
  @UseInterceptors(AccessFiltersInterceptor)
  @ApiResponse(PlayerBasicDataDto, { type: 'read' })
  @Serialize(PlayerBasicDataDto)
  async getList(
    @I18nLang() lang: string,
    @Query() query: FindAllPlayersDto,
    @CurrentUser() user: CurrentUserDto,
    @AccessFilters() accessFilters: Prisma.PlayerWhereInput,
  ) {
    const players = await this.playersService.getList(
      query,
      user.id,
      accessFilters,
    );
    const message = this.i18n.translate('players.GET_LIST_MESSAGE', {
      lang,
    });
    return formatSuccessResponse(message, players);
  }

  @Get(':id')
  @UseGuards(ReadGuard)
  @ApiResponse(PlayerDto, { type: 'read' })
  @Serialize(PlayerDto)
  async findOne(
    @I18nLang() lang: string,
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const player = await this.playersService.findOne(id, user.id);
    const message = this.i18n.translate('players.GET_ONE_MESSAGE', {
      lang,
      args: { name: `${player.firstName} ${player.lastName}` },
    });
    return formatSuccessResponse(message, player);
  }

  @Get('by-slug/:slug')
  @UseGuards(ReadGuard)
  @ApiResponse(PlayerDto, { type: 'read' })
  @Serialize(PlayerDto)
  async findOneBySlug(
    @I18nLang() lang: string,
    @Param('slug') slug: string,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const player = await this.playersService.findOneBySlug(slug, user.id);
    const message = this.i18n.translate('players.GET_ONE_MESSAGE', {
      lang,
      args: { name: `${player.firstName} ${player.lastName}` },
    });
    return formatSuccessResponse(message, player);
  }

  @Patch(':id')
  @UseGuards(AdminOrAuthorGuard)
  @ApiResponse(PlayerDto, { type: 'update' })
  @Serialize(PlayerDto)
  async update(
    @I18nLang() lang: string,
    @Param('id') id: string,
    @Body() updatePlayerDto: UpdatePlayerDto,
  ) {
    const player = await this.playersService.update(id, updatePlayerDto);
    const message = this.i18n.translate('players.UPDATE_MESSAGE', {
      lang,
      args: { name: `${player.firstName} ${player.lastName}` },
    });
    return formatSuccessResponse(message, player);
  }

  @Delete(':id')
  @UseGuards(AdminOrAuthorGuard)
  @ApiResponse(PlayerDto, { type: 'delete' })
  @Serialize(PlayerDto)
  async remove(@I18nLang() lang: string, @Param('id') id: string) {
    const player = await this.playersService.remove(id);
    const message = this.i18n.translate('players.DELETE_MESSAGE', {
      lang,
      args: { name: `${player.firstName} ${player.lastName}` },
    });
    return formatSuccessResponse(message, player);
  }
}
