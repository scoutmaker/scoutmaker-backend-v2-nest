import { Injectable } from '@nestjs/common';

import { CreateUserPlayerAceDto } from './dto/create-user-player-ace.dto';
import { UpdateUserPlayerAceDto } from './dto/update-user-player-ace.dto';

@Injectable()
export class UserPlayerAclService {
  create(createAceDto: CreateUserPlayerAceDto) {
    return 'This action adds a new userPlayerAcl';
  }

  findAll() {
    return `This action returns all userPlayerAcl`;
  }

  findOne(id: string) {
    return `This action returns a #${id} userPlayerAcl`;
  }

  update(id: string, updateAceDto: UpdateUserPlayerAceDto) {
    return null;
  }

  remove(id: string) {
    return `This action removes a #${id} userPlayerAcl`;
  }
}
