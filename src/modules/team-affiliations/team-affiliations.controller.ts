import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TeamAffiliationsService } from './team-affiliations.service';
import { CreateTeamAffiliationDto } from './dto/create-team-affiliation.dto';
import { UpdateTeamAffiliationDto } from './dto/update-team-affiliation.dto';

@Controller('team-affiliations')
export class TeamAffiliationsController {
  constructor(
    private readonly teamAffiliationsService: TeamAffiliationsService,
  ) {}

  @Post()
  create(@Body() createTeamAffiliationDto: CreateTeamAffiliationDto) {
    return this.teamAffiliationsService.create(createTeamAffiliationDto);
  }

  @Get()
  findAll() {
    return this.teamAffiliationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamAffiliationsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTeamAffiliationDto: UpdateTeamAffiliationDto,
  ) {
    return this.teamAffiliationsService.update(id, updateTeamAffiliationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamAffiliationsService.remove(id);
  }
}
