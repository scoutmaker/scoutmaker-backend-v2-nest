import { Injectable } from '@nestjs/common';
import { CreateTeamAffiliationDto } from './dto/create-team-affiliation.dto';
import { UpdateTeamAffiliationDto } from './dto/update-team-affiliation.dto';

@Injectable()
export class TeamAffiliationsService {
  create(createTeamAffiliationDto: CreateTeamAffiliationDto) {
    return 'This action adds a new teamAffiliation';
  }

  findAll() {
    return `This action returns all teamAffiliations`;
  }

  findOne(id: string) {
    return `This action returns a #${id} teamAffiliation`;
  }

  update(id: string, updateTeamAffiliationDto: UpdateTeamAffiliationDto) {
    return `This action updates a #${id} teamAffiliation`;
  }

  remove(id: string) {
    return `This action removes a #${id} teamAffiliation`;
  }
}
