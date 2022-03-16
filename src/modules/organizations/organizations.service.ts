import { Injectable } from '@nestjs/common';

import { CreateOrganizationDto } from './dto/create-organization.dto';

@Injectable()
export class OrganizationsService {
  create(createOrganizationDto: CreateOrganizationDto) {
    return 'This action adds a new organization';
  }

  findAll() {
    return `This action returns all organizations`;
  }

  findOne(id: string) {
    return `This action returns a #${id} organization`;
  }

  update(id: string) {
    return `This action updates a #${id} organization`;
  }

  remove(id: string) {
    return `This action removes a #${id} organization`;
  }
}
