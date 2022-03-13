import { Injectable } from '@nestjs/common';

import { AgenciesPaginationOptions } from './dto/agencies-pagination-options.dto';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { FindAllAgenciesDto } from './dto/find-all-agencies.dto';
import { UpdateAgencyDto } from './dto/update-agency.dto';

@Injectable()
export class AgenciesService {
  create(createAgencyDto: CreateAgencyDto) {
    return 'This action adds a new agency';
  }

  findAll({}: AgenciesPaginationOptions, {}: FindAllAgenciesDto) {
    return `This action returns all agencies`;
  }

  getList() {
    return `This action returns all agencies list`;
  }

  findOne(id: string) {
    return `This action returns a #${id} agency`;
  }

  update(id: string, updateAgencyDto: UpdateAgencyDto) {
    return `This action updates a #${id} agency`;
  }

  remove(id: string) {
    return `This action removes a #${id} agency`;
  }
}
