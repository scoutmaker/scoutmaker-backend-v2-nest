import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { I18nLang, I18nService } from 'nestjs-i18n';

import { ApiResponse } from '../../api-response/api-response.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { formatSuccessResponse } from '../../utils/helpers';
import { CreateTeamAffiliationDto } from './dto/create-team-affiliation.dto';
import { TeamAffiliationDto } from './dto/team-affiliation.dto';
import { UpdateTeamAffiliationDto } from './dto/update-team-affiliation.dto';
import { TeamAffiliationsService } from './team-affiliations.service';

@Controller('team-affiliations')
@ApiTags('team affiliations')
@UseGuards(AuthGuard)
@ApiCookieAuth()
@Serialize(TeamAffiliationDto)
export class TeamAffiliationsController {
  constructor(
    private readonly teamAffiliationsService: TeamAffiliationsService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(TeamAffiliationDto, { type: 'create' })
  async create(
    @I18nLang() lang: string,
    @Body() createTeamAffiliationDto: CreateTeamAffiliationDto,
  ) {
    const affiliation = await this.teamAffiliationsService.create(
      createTeamAffiliationDto,
    );
    const message = await this.i18n.translate(
      'team-affiliations.CREATE_MESSAGE',
      {
        lang,
        args: {
          playerName: `${affiliation.player.firstName} ${affiliation.player.lastName}`,
          teamName: `${affiliation.team.name}`,
        },
      },
    );
    return formatSuccessResponse(message, affiliation);
  }

  @Get()
  @ApiResponse(TeamAffiliationDto, { type: 'read' })
  async findAll(@I18nLang() lang: string) {
    const affiliations = await this.teamAffiliationsService.findAll();
    const message = await this.i18n.translate(
      'team-affiliations.GET_LIST_MESSAGE',
      { lang },
    );
    return formatSuccessResponse(message, affiliations);
  }

  @Get(':id')
  @ApiResponse(TeamAffiliationDto, { type: 'read' })
  async findOne(@I18nLang() lang: string, @Param('id') id: string) {
    const affiliation = await this.teamAffiliationsService.findOne(id);
    const message = await this.i18n.translate(
      'team-affiliations.GET_ONE_MESSAGE',
      {
        lang,
        args: {
          playerName: `${affiliation.player.firstName} ${affiliation.player.lastName}`,
          teamName: `${affiliation.team.name}`,
        },
      },
    );
    return formatSuccessResponse(message, affiliation);
  }

  @Patch(':id')
  @ApiResponse(TeamAffiliationDto, { type: 'update' })
  async update(
    @I18nLang() lang: string,
    @Param('id') id: string,
    @Body() updateTeamAffiliationDto: UpdateTeamAffiliationDto,
  ) {
    const affiliation = await this.teamAffiliationsService.update(
      id,
      updateTeamAffiliationDto,
    );
    const message = await this.i18n.translate(
      'team-affiliations.UPDATE_MESSAGE',
      {
        lang,
        args: {
          playerName: `${affiliation.player.firstName} ${affiliation.player.lastName}`,
          teamName: `${affiliation.team.name}`,
        },
      },
    );
    return formatSuccessResponse(message, affiliation);
  }

  @Delete(':id')
  @ApiResponse(TeamAffiliationDto, { type: 'delete' })
  async remove(@I18nLang() lang: string, @Param('id') id: string) {
    const affiliation = await this.teamAffiliationsService.remove(id);
    const message = await this.i18n.translate(
      'team-affiliations.DELETE_MESSAGE',
      {
        lang,
        args: {
          playerName: `${affiliation.player.firstName} ${affiliation.player.lastName}`,
          teamName: `${affiliation.team.name}`,
        },
      },
    );
    return formatSuccessResponse(message, affiliation);
  }
}
