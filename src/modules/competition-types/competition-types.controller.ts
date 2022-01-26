import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CompetitionTypesService } from './competition-types.service';
import { CreateCompetitionTypeDto } from './dto/create-competition-type.dto';
import { UpdateCompetitionTypeDto } from './dto/update-competition-type.dto';

@Controller('competition-types')
export class CompetitionTypesController {
  constructor(private readonly competitionTypesService: CompetitionTypesService) {}

  @Post()
  create(@Body() createCompetitionTypeDto: CreateCompetitionTypeDto) {
    return this.competitionTypesService.create(createCompetitionTypeDto);
  }

  @Get()
  findAll() {
    return this.competitionTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.competitionTypesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompetitionTypeDto: UpdateCompetitionTypeDto) {
    return this.competitionTypesService.update(+id, updateCompetitionTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.competitionTypesService.remove(+id);
  }
}
