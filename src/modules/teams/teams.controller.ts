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

import { ApiPaginatedResponse } from '../../common/api-response/api-paginated-response.decorator';
import { ApiResponse } from '../../common/api-response/api-response.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
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
@ApiCookieAuth()
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
    const message = await this.i18n.translate('teams.CREATE_MESSAGE', {
      lang,
      args: { name: team.name },
    });
    return formatSuccessResponse(message, team);
  }

  @Get()
  @ApiPaginatedResponse(TeamDto)
  @ApiQuery({ type: TeamsPaginationOptionsDto })
  @Serialize(TeamDto, 'docs')
  async findAll(
    @I18nLang() lang: string,
    @PaginationOptions() paginationOptions: TeamsPaginationOptionsDto,
    @Query() query: FindAllTeamsDto,
  ) {
    const data = await this.teamsService.findAll(paginationOptions, query);
    const message = await this.i18n.translate('teams.GET_ALL_MESSAGE', {
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
  async getList(@I18nLang() lang: string) {
    const teams = await this.teamsService.getList();
    const message = await this.i18n.translate('teams.GET_LIST_MESSAGE', {
      lang,
    });
    return formatSuccessResponse(message, teams);
  }

  @Get(':id')
  @ApiResponse(TeamDto, { type: 'read' })
  @Serialize(TeamDto)
  async findOne(@I18nLang() lang: string, @Param('id') id: string) {
    const team = await this.teamsService.findOne(id);
    const message = await this.i18n.translate('teams.GET_ONE_MESSAGE', {
      lang,
      args: { name: team.name },
    });
    return formatSuccessResponse(message, team);
  }

  @Patch(':id')
  @ApiResponse(TeamDto, { type: 'update' })
  @Serialize(TeamDto)
  async update(
    @I18nLang() lang: string,
    @Param('id') id: string,
    @Body() updateTeamDto: UpdateTeamDto,
  ) {
    const team = await this.teamsService.update(id, updateTeamDto);
    const message = await this.i18n.translate('teams.UPDATE_MESSAGE', {
      lang,
      args: { name: team.name },
    });
    return formatSuccessResponse(message, team);
  }

  @Delete(':id')
  @ApiResponse(TeamDto, { type: 'delete' })
  @Serialize(TeamDto)
  async remove(@I18nLang() lang: string, @Param('id') id: string) {
    const team = await this.teamsService.remove(id);
    const message = await this.i18n.translate('teams.DELETE_MESSAGE', {
      lang,
      args: { name: team.name },
    });
    return formatSuccessResponse(message, team);
  }
}
