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
import { CreateTeamAffiliationDto } from './dto/create-team-affiliation.dto';
import { FindAllTeamAffiliationsDto } from './dto/find-all-team-affiliations.dto';
import { TeamAffiliationDto } from './dto/team-affiliation.dto';
import { TeamAffiliationsPaginationOptionsDto } from './dto/team-affiliations-pagination-options.dto';
import { UpdateTeamAffiliationDto } from './dto/update-team-affiliation.dto';
import { TeamAffiliationsService } from './team-affiliations.service';

@Controller('team-affiliations')
@ApiTags('team affiliations')
@UseGuards(AuthGuard)
@ApiCookieAuth()
export class TeamAffiliationsController {
  constructor(
    private readonly teamAffiliationsService: TeamAffiliationsService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(TeamAffiliationDto, { type: 'create' })
  @Serialize(TeamAffiliationDto)
  async create(
    @I18nLang() lang: string,
    @Body() createTeamAffiliationDto: CreateTeamAffiliationDto,
  ) {
    const affiliation = await this.teamAffiliationsService.create(
      createTeamAffiliationDto,
    );
    const message = this.i18n.translate('team-affiliations.CREATE_MESSAGE', {
      lang,
      args: {
        playerName: `${affiliation.player.firstName} ${affiliation.player.lastName}`,
        teamName: `${affiliation.team.name}`,
      },
    });
    return formatSuccessResponse(message, affiliation);
  }

  @Get()
  @ApiPaginatedResponse(TeamAffiliationDto)
  @ApiQuery({ type: TeamAffiliationsPaginationOptionsDto })
  @Serialize(TeamAffiliationDto, 'docs')
  async findAll(
    @I18nLang() lang: string,
    @PaginationOptions()
    paginationOptions: TeamAffiliationsPaginationOptionsDto,
    @Query() query: FindAllTeamAffiliationsDto,
  ) {
    const data = await this.teamAffiliationsService.findAll(
      paginationOptions,
      query,
    );
    const message = this.i18n.translate('team-affiliations.GET_ALL_MESSAGE', {
      lang,
      args: {
        currentPage: data.page,
        totalPages: data.totalPages,
      },
    });
    return formatSuccessResponse(message, data);
  }

  @Get('list')
  @ApiResponse(TeamAffiliationDto, { type: 'read' })
  @Serialize(TeamAffiliationDto)
  async getList(@I18nLang() lang: string) {
    const affiliations = await this.teamAffiliationsService.getList();
    const message = this.i18n.translate('team-affiliations.GET_LIST_MESSAGE', {
      lang,
    });
    return formatSuccessResponse(message, affiliations);
  }

  @Get(':id')
  @ApiResponse(TeamAffiliationDto, { type: 'read' })
  @Serialize(TeamAffiliationDto)
  async findOne(@I18nLang() lang: string, @Param('id') id: number) {
    const affiliation = await this.teamAffiliationsService.findOne(id);
    const message = this.i18n.translate('team-affiliations.GET_ONE_MESSAGE', {
      lang,
      args: {
        playerName: `${affiliation.player.firstName} ${affiliation.player.lastName}`,
        teamName: `${affiliation.team.name}`,
      },
    });
    return formatSuccessResponse(message, affiliation);
  }

  @Patch(':id')
  @ApiResponse(TeamAffiliationDto, { type: 'update' })
  @Serialize(TeamAffiliationDto)
  async update(
    @I18nLang() lang: string,
    @Param('id') id: number,
    @Body() updateTeamAffiliationDto: UpdateTeamAffiliationDto,
  ) {
    const affiliation = await this.teamAffiliationsService.update(
      id,
      updateTeamAffiliationDto,
    );
    const message = this.i18n.translate('team-affiliations.UPDATE_MESSAGE', {
      lang,
      args: {
        playerName: `${affiliation.player.firstName} ${affiliation.player.lastName}`,
        teamName: `${affiliation.team.name}`,
      },
    });
    return formatSuccessResponse(message, affiliation);
  }

  @Delete(':id')
  @ApiResponse(TeamAffiliationDto, { type: 'delete' })
  @Serialize(TeamAffiliationDto)
  async remove(@I18nLang() lang: string, @Param('id') id: number) {
    const affiliation = await this.teamAffiliationsService.remove(id);
    const message = this.i18n.translate('team-affiliations.DELETE_MESSAGE', {
      lang,
      args: {
        playerName: `${affiliation.player.firstName} ${affiliation.player.lastName}`,
        teamName: `${affiliation.team.name}`,
      },
    });
    return formatSuccessResponse(message, affiliation);
  }
}
