import { Injectable } from '@nestjs/common';
import { CreateCompetitionParticipationDto } from './dto/create-competition-participation.dto';
import { UpdateCompetitionParticipationDto } from './dto/update-competition-participation.dto';

@Injectable()
export class CompetitionParticipationsService {
  create(createCompetitionParticipationDto: CreateCompetitionParticipationDto) {
    return 'This action adds a new competitionParticipation';
  }

  findAll() {
    return `This action returns all competitionParticipations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} competitionParticipation`;
  }

  update(id: number, updateCompetitionParticipationDto: UpdateCompetitionParticipationDto) {
    return `This action updates a #${id} competitionParticipation`;
  }

  remove(id: number) {
    return `This action removes a #${id} competitionParticipation`;
  }
}
