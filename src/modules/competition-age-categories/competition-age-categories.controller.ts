import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CompetitionAgeCategoriesService } from './competition-age-categories.service';
import { CreateCompetitionAgeCategoryDto } from './dto/create-competition-age-category.dto';
import { UpdateCompetitionAgeCategoryDto } from './dto/update-competition-age-category.dto';

@Controller('competition-age-categories')
export class CompetitionAgeCategoriesController {
  constructor(private readonly competitionAgeCategoriesService: CompetitionAgeCategoriesService) {}

  @Post()
  create(@Body() createCompetitionAgeCategoryDto: CreateCompetitionAgeCategoryDto) {
    return this.competitionAgeCategoriesService.create(createCompetitionAgeCategoryDto);
  }

  @Get()
  findAll() {
    return this.competitionAgeCategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.competitionAgeCategoriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompetitionAgeCategoryDto: UpdateCompetitionAgeCategoryDto) {
    return this.competitionAgeCategoriesService.update(+id, updateCompetitionAgeCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.competitionAgeCategoriesService.remove(+id);
  }
}
