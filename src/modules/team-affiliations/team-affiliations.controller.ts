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
  ) {}

  @Post()
  @ApiResponse(TeamAffiliationDto, { type: 'create' })
  async create(@Body() createTeamAffiliationDto: CreateTeamAffiliationDto) {
    const affiliation = await this.teamAffiliationsService.create(
      createTeamAffiliationDto,
    );
    return formatSuccessResponse(
      'Successfully created new team affiliation',
      affiliation,
    );
  }

  @Get()
  @ApiResponse(TeamAffiliationDto, { type: 'read' })
  async findAll() {
    const affiliations = await this.teamAffiliationsService.findAll();
    return formatSuccessResponse(
      'Successfully fetched all team affiliations',
      affiliations,
    );
  }

  @Get(':id')
  @ApiResponse(TeamAffiliationDto, { type: 'read' })
  async findOne(@Param('id') id: string) {
    const affiliation = await this.teamAffiliationsService.findOne(id);
    return formatSuccessResponse(
      `Successfully fetched team affiliation with the id of ${id}`,
      affiliation,
    );
  }

  @Patch(':id')
  @ApiResponse(TeamAffiliationDto, { type: 'update' })
  async update(
    @Param('id') id: string,
    @Body() updateTeamAffiliationDto: UpdateTeamAffiliationDto,
  ) {
    const affiliation = await this.teamAffiliationsService.update(
      id,
      updateTeamAffiliationDto,
    );
    return formatSuccessResponse(
      `Successfully updated team affiliation with the id of ${id}`,
      affiliation,
    );
  }

  @Delete(':id')
  @ApiResponse(TeamAffiliationDto, { type: 'delete' })
  async remove(@Param('id') id: string) {
    const affiliation = await this.teamAffiliationsService.remove(id);
    return formatSuccessResponse(
      `Successfully removed team affiliation with the id of ${id}`,
      affiliation,
    );
  }
}
