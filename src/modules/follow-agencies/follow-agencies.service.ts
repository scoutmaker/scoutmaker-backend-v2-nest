import { Injectable } from '@nestjs/common';

import { CreateFollowAgencyDto } from './dto/create-follow-agency.dto';

@Injectable()
export class FollowAgenciesService {
  create(createFollowAgencyDto: CreateFollowAgencyDto) {
    return 'This action adds a new followAgency';
  }

  remove(id: number) {
    return `This action removes a #${id} followAgency`;
  }
}
