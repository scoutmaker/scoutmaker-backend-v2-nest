import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CompetitionParticipationsService } from './competition-participations.service';
import { CreateCompetitionParticipationDto } from './dto/create-competition-participation.dto';
import { UpdateCompetitionParticipationDto } from './dto/update-competition-participation.dto';

@Controller('competition-participations')
export class CompetitionParticipationsController {
  constructor(private readonly competitionParticipationsService: CompetitionParticipationsService) {}

  @Post()
  create(@Body() createCompetitionParticipationDto: CreateCompetitionParticipationDto) {
    return this.competitionParticipationsService.create(createCompetitionParticipationDto);
  }

  @Get()
  findAll() {
    return this.competitionParticipationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.competitionParticipationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompetitionParticipationDto: UpdateCompetitionParticipationDto) {
    return this.competitionParticipationsService.update(+id, updateCompetitionParticipationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.competitionParticipationsService.remove(+id);
  }
}
