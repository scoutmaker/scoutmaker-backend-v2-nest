import { Injectable } from '@nestjs/common';
import { CreateCompetitionTypeDto } from './dto/create-competition-type.dto';
import { UpdateCompetitionTypeDto } from './dto/update-competition-type.dto';

@Injectable()
export class CompetitionTypesService {
  create(createCompetitionTypeDto: CreateCompetitionTypeDto) {
    return 'This action adds a new competitionType';
  }

  findAll() {
    return `This action returns all competitionTypes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} competitionType`;
  }

  update(id: number, updateCompetitionTypeDto: UpdateCompetitionTypeDto) {
    return `This action updates a #${id} competitionType`;
  }

  remove(id: number) {
    return `This action removes a #${id} competitionType`;
  }
}
