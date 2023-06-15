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
import { AdminOrAuthorGuard } from '../../common/guards/admin-or-author.guard';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { PaginationOptions } from '../../common/pagination/pagination-options.decorator';
import { formatSuccessResponse } from '../../utils/helpers';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { CurrentUserDto } from '../users/dto/current-user.dto';
import { CreatePlayerGradeDto } from './dto/create-player-grade.dto';
import { FindAllPlayerGradesDto } from './dto/find-all-player-grades.dto';
import { PlayerGradeDto } from './dto/player-grade.dto';
import { PlayerGradesPaginationOptionsDto } from './dto/player-grades-pagination-options.dto';
import { UpdatePlayerGradeDto } from './dto/update-player-grade.dto';
import { PlayerGradesService } from './player-grades.service';

@Controller('player-grades')
@ApiTags('player-grades')
@UseGuards(AuthGuard)
@ApiSecurity('auth-token')
export class PlayerGradesController {
  constructor(
    private readonly playerGradesService: PlayerGradesService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(PlayerGradeDto, { type: 'create' })
  @Serialize(PlayerGradeDto)
  @UseGuards(new RoleGuard(['ADMIN', 'PLAYMAKER_SCOUT_MANAGER']))
  async create(
    @Body() createPlayerGradeDto: CreatePlayerGradeDto,
    @I18nLang() lang: string,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const grade = await this.playerGradesService.create(
      createPlayerGradeDto,
      user.id,
    );

    const message = this.i18n.translate('player-grades.CREATE_MESSAGE', {
      lang,
    });
    return formatSuccessResponse(message, grade);
  }

  @Get()
  @ApiPaginatedResponse(PlayerGradeDto)
  @ApiQuery({ type: PlayerGradesPaginationOptionsDto })
  @Serialize(PlayerGradeDto, 'docs')
  async findAll(
    @Query() query: FindAllPlayerGradesDto,
    @PaginationOptions() paginationOptions: PlayerGradesPaginationOptionsDto,
    @I18nLang() lang: string,
  ) {
    const data = await this.playerGradesService.findAll(
      paginationOptions,
      query,
    );

    const message = this.i18n.translate('player-grades.GET_ALL_MESSAGE', {
      lang,
      args: { currentPage: data.page, totalPages: data.totalPages },
    });
    return formatSuccessResponse(message, data);
  }

  @Get(':id')
  @ApiResponse(PlayerGradeDto, { type: 'read' })
  @Serialize(PlayerGradeDto)
  async findOne(@Param('id') id: string, @I18nLang() lang: string) {
    const data = await this.playerGradesService.findOne(id);
    const message = this.i18n.translate('player-grades.GET_ONE_MESSAGE', {
      lang,
    });
    return formatSuccessResponse(message, data);
  }

  @Patch(':id')
  @UseGuards(AdminOrAuthorGuard)
  @ApiResponse(PlayerGradeDto, { type: 'update' })
  @Serialize(PlayerGradeDto)
  async update(
    @Param('id') id: string,
    @Body() updatePlayerGradeDto: UpdatePlayerGradeDto,
    @I18nLang() lang: string,
  ) {
    const data = await this.playerGradesService.update(
      id,
      updatePlayerGradeDto,
    );

    const message = this.i18n.translate('player-grades.UPDATE_MESSAGE', {
      lang,
    });
    return formatSuccessResponse(message, data);
  }

  @Delete(':id')
  @UseGuards(AdminOrAuthorGuard)
  @ApiResponse(PlayerGradeDto, { type: 'delete' })
  @Serialize(PlayerGradeDto)
  async remove(@Param('id') id: string, @I18nLang() lang: string) {
    const data = await this.playerGradesService.remove(id);
    const message = this.i18n.translate('player-grades.DELETE_MESSAGE', {
      lang,
    });
    return formatSuccessResponse(message, data);
  }
}
