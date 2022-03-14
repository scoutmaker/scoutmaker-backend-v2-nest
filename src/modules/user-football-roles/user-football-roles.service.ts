import { Injectable } from '@nestjs/common';
import { CreateUserFootballRoleDto } from './dto/create-user-football-role.dto';
import { UpdateUserFootballRoleDto } from './dto/update-user-football-role.dto';

@Injectable()
export class UserFootballRolesService {
  create(createUserFootballRoleDto: CreateUserFootballRoleDto) {
    return 'This action adds a new userFootballRole';
  }

  findAll() {
    return `This action returns all userFootballRoles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userFootballRole`;
  }

  update(id: number, updateUserFootballRoleDto: UpdateUserFootballRoleDto) {
    return `This action updates a #${id} userFootballRole`;
  }

  remove(id: number) {
    return `This action removes a #${id} userFootballRole`;
  }
}
