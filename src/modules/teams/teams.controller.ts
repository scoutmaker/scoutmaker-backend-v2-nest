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
import { AdminOrAuthorGuard } from '../../common/guards/admin-or-author.guard';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { PaginationOptions } from '../../common/pagination/pagination-options.decorator';
import { formatSuccessResponse } from '../../utils/helpers';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { CurrentUserDto } from '../users/dto/current-user.dto';
import { CreateTeamDto } from './dto/create-team.dto';
import { FindAllTeamsDto } from './dto/find-all-teams.dto';
import { TeamBasicDataDto, TeamDto } from './dto/team.dto';
import { TeamsPaginationOptionsDto } from './dto/teams-pagination-options.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamsService } from './teams.service';

@Controller('teams')
@ApiTags('teams')
@UseGuards(AuthGuard)
@ApiSecurity('auth-token')
export class TeamsController {
  constructor(
    private readonly teamsService: TeamsService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(TeamDto, { type: 'create' })
  @Serialize(TeamDto)
  async create(
    @I18nLang() lang: string,
    @Body() createTeamDto: CreateTeamDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const team = await this.teamsService.create(createTeamDto, user.id);
    const message = this.i18n.translate('teams.CREATE_MESSAGE', {
      lang,
      args: { name: team.name },
    });
    return formatSuccessResponse(message, team);
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
      await this.teamsService.createManyFromCsv(file);
    return formatSuccessResponse('Success!', {
      csvRowsCount,
      createdCount,
      errors,
    });
  }

  @Get()
  @ApiPaginatedResponse(TeamDto)
  @ApiQuery({ type: TeamsPaginationOptionsDto })
  @Serialize(TeamDto, 'docs')
  async findAll(
    @I18nLang() lang: string,
    @PaginationOptions() paginationOptions: TeamsPaginationOptionsDto,
    @Query() query: FindAllTeamsDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const data = await this.teamsService.findAll(
      paginationOptions,
      query,
      user.id,
    );
    const message = this.i18n.translate('teams.GET_ALL_MESSAGE', {
      lang,
      args: {
        currentPage: data.page,
        totalPages: data.totalPages,
      },
    });
    return formatSuccessResponse(message, data);
  }

  @Get('list')
  @ApiResponse(TeamBasicDataDto, { type: 'read' })
  @Serialize(TeamBasicDataDto)
  async getList(
    @I18nLang() lang: string,
    @Query() query: FindAllTeamsDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const teams = await this.teamsService.getList(query, user.id);
    const message = this.i18n.translate('teams.GET_LIST_MESSAGE', {
      lang,
    });
    return formatSuccessResponse(message, teams);
  }

  @Get(':id')
  @ApiResponse(TeamDto, { type: 'read' })
  @Serialize(TeamDto)
  async findOne(
    @I18nLang() lang: string,
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const team = await this.teamsService.findOne(id, user.id);
    const message = this.i18n.translate('teams.GET_ONE_MESSAGE', {
      lang,
      args: { name: team.name },
    });
    return formatSuccessResponse(message, team);
  }

  @Get('by-slug/:slug')
  @ApiResponse(TeamDto, { type: 'read' })
  @Serialize(TeamDto)
  async findOneBySlug(
    @I18nLang() lang: string,
    @Param('slug') slug: string,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const team = await this.teamsService.findOneBySlug(slug, user.id);
    const message = this.i18n.translate('teams.GET_ONE_MESSAGE', {
      lang,
      args: { name: team.name },
    });
    return formatSuccessResponse(message, team);
  }

  @Patch(':id')
  @UseGuards(AdminOrAuthorGuard)
  @ApiResponse(TeamDto, { type: 'update' })
  @Serialize(TeamDto)
  async update(
    @I18nLang() lang: string,
    @Param('id') id: string,
    @Body() updateTeamDto: UpdateTeamDto,
  ) {
    const team = await this.teamsService.update(id, updateTeamDto);
    const message = this.i18n.translate('teams.UPDATE_MESSAGE', {
      lang,
      args: { name: team.name },
    });
    return formatSuccessResponse(message, team);
  }

  @Delete(':id')
  @UseGuards(AdminOrAuthorGuard)
  @ApiResponse(TeamDto, { type: 'delete' })
  @Serialize(TeamDto)
  async remove(@I18nLang() lang: string, @Param('id') id: string) {
    const team = await this.teamsService.remove(id);
    const message = this.i18n.translate('teams.DELETE_MESSAGE', {
      lang,
      args: { name: team.name },
    });
    return formatSuccessResponse(message, team);
  }
}
