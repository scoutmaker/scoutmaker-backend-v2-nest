import { Injectable } from '@nestjs/common';
import { CreateCompetitionAgeCategoryDto } from './dto/create-competition-age-category.dto';
import { UpdateCompetitionAgeCategoryDto } from './dto/update-competition-age-category.dto';

@Injectable()
export class CompetitionAgeCategoriesService {
  create(createCompetitionAgeCategoryDto: CreateCompetitionAgeCategoryDto) {
    return 'This action adds a new competitionAgeCategory';
  }

  findAll() {
    return `This action returns all competitionAgeCategories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} competitionAgeCategory`;
  }

  update(id: number, updateCompetitionAgeCategoryDto: UpdateCompetitionAgeCategoryDto) {
    return `This action updates a #${id} competitionAgeCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} competitionAgeCategory`;
  }
}
