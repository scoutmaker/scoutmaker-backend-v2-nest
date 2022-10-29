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
  ApiCookieAuth,
  ApiQuery,
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
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { CurrentUserDto } from '../users/dto/current-user.dto';
import { CreateMatchDto } from './dto/create-match.dto';
import { FindAllMatchesDto } from './dto/find-all-matches.dto';
import { MatchBasicDataDto, MatchDto } from './dto/match.dto';
import { MatchesPaginationOptionsDto } from './dto/matches-pagination-options.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { DeleteGuard } from './guards/delete.guard';
import { UpdateGuard } from './guards/update.guard';
import { MatchesService } from './matches.service';

@Controller('matches')
@ApiTags('matches')
@UseGuards(AuthGuard)
@ApiCookieAuth()
export class MatchesController {
  constructor(
    private readonly matchesService: MatchesService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(MatchDto, { type: 'create' })
  @Serialize(MatchDto)
  async create(
    @I18nLang() lang: string,
    @Body() createMatchDto: CreateMatchDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const match = await this.matchesService.create(createMatchDto, user.id);
    const message = this.i18n.translate('matches.CREATE_MESSAGE', {
      lang,
      args: {
        homeTeamName: match.homeTeam.name,
        awayTeamName: match.awayTeam.name,
      },
    });
    return formatSuccessResponse(message, match);
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
      await this.matchesService.createManyFromCsv(file);
    return formatSuccessResponse('Success!', {
      csvRowsCount,
      createdCount,
      errors,
    });
  }

  @Get()
  @ApiPaginatedResponse(MatchDto)
  @ApiQuery({ type: MatchesPaginationOptionsDto })
  @Serialize(MatchDto, 'docs')
  async findAll(
    @I18nLang() lang: string,
    @PaginationOptions() paginationOptions: MatchesPaginationOptionsDto,
    @Query() query: FindAllMatchesDto,
  ) {
    const data = await this.matchesService.findAll(paginationOptions, query);
    const message = this.i18n.translate('matches.GET_ALL_MESSAGE', {
      lang,
      args: {
        currentPage: data.page,
        totalPages: data.totalPages,
      },
    });
    return formatSuccessResponse(message, data);
  }

  @Get('list')
  @ApiResponse(MatchBasicDataDto, { type: 'read' })
  @Serialize(MatchBasicDataDto)
  async getList(@I18nLang() lang: string, @Query() query: FindAllMatchesDto) {
    const matches = await this.matchesService.getList(query);
    const message = this.i18n.translate('matches.GET_LIST_MESSAGE', {
      lang,
    });
    return formatSuccessResponse(message, matches);
  }

  @Get(':id')
  @ApiResponse(MatchDto, { type: 'read' })
  @Serialize(MatchDto)
  async findOne(@I18nLang() lang: string, @Param('id') id: string) {
    const match = await this.matchesService.findOne(id);
    const message = this.i18n.translate('matches.GET_ONE_MESSAGE', {
      lang,
      args: {
        homeTeamName: match.homeTeam.name,
        awayTeamName: match.awayTeam.name,
      },
    });
    return formatSuccessResponse(message, match);
  }

  @Patch(':id')
  @UseGuards(UpdateGuard)
  @ApiResponse(MatchDto, { type: 'update' })
  @Serialize(MatchDto)
  async update(
    @I18nLang() lang: string,
    @Param('id') id: string,
    @Body() updateMatchDto: UpdateMatchDto,
  ) {
    const match = await this.matchesService.update(id, updateMatchDto);
    const message = this.i18n.translate('matches.UPDATE_MESSAGE', {
      lang,
      args: {
        homeTeamName: match.homeTeam.name,
        awayTeamName: match.awayTeam.name,
      },
    });
    return formatSuccessResponse(message, match);
  }

  @Delete(':id')
  @UseGuards(DeleteGuard)
  @ApiResponse(MatchDto, { type: 'delete' })
  @Serialize(MatchDto)
  async remove(
    @I18nLang() lang: string,

    @Param('id') id: string,
  ) {
    const match = await this.matchesService.remove(id);
    const message = this.i18n.translate('matches.DELETE_MESSAGE', {
      lang,
      args: {
        homeTeamName: match.homeTeam.name,
        awayTeamName: match.awayTeam.name,
      },
    });
    return formatSuccessResponse(message, match);
  }
}
