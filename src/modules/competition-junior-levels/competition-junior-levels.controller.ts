import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CompetitionJuniorLevelsService } from './competition-junior-levels.service';
import { CreateCompetitionJuniorLevelDto } from './dto/create-competition-junior-level.dto';
import { UpdateCompetitionJuniorLevelDto } from './dto/update-competition-junior-level.dto';

@Controller('competition-junior-levels')
export class CompetitionJuniorLevelsController {
  constructor(private readonly competitionJuniorLevelsService: CompetitionJuniorLevelsService) {}

  @Post()
  create(@Body() createCompetitionJuniorLevelDto: CreateCompetitionJuniorLevelDto) {
    return this.competitionJuniorLevelsService.create(createCompetitionJuniorLevelDto);
  }

  @Get()
  findAll() {
    return this.competitionJuniorLevelsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.competitionJuniorLevelsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompetitionJuniorLevelDto: UpdateCompetitionJuniorLevelDto) {
    return this.competitionJuniorLevelsService.update(+id, updateCompetitionJuniorLevelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.competitionJuniorLevelsService.remove(+id);
  }
}
