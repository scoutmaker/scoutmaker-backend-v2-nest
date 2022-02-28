import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TeamAffiliationsService } from './team-affiliations.service';
import { CreateTeamAffiliationDto } from './dto/create-team-affiliation.dto';
import { UpdateTeamAffiliationDto } from './dto/update-team-affiliation.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { TeamAffiliationDto } from './dto/team-affiliation.dto';
import { ApiResponse } from '../../api-response/api-response.decorator';
import { formatSuccessResponse } from '../../utils/helpers';

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
