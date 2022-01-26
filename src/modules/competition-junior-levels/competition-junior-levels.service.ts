import { Injectable } from '@nestjs/common';
import { CreateCompetitionJuniorLevelDto } from './dto/create-competition-junior-level.dto';
import { UpdateCompetitionJuniorLevelDto } from './dto/update-competition-junior-level.dto';

@Injectable()
export class CompetitionJuniorLevelsService {
  create(createCompetitionJuniorLevelDto: CreateCompetitionJuniorLevelDto) {
    return 'This action adds a new competitionJuniorLevel';
  }

  findAll() {
    return `This action returns all competitionJuniorLevels`;
  }

  findOne(id: number) {
    return `This action returns a #${id} competitionJuniorLevel`;
  }

  update(id: number, updateCompetitionJuniorLevelDto: UpdateCompetitionJuniorLevelDto) {
    return `This action updates a #${id} competitionJuniorLevel`;
  }

  remove(id: number) {
    return `This action removes a #${id} competitionJuniorLevel`;
  }
}
