import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreateUserPlayerAceDto } from './dto/create-user-player-ace.dto';
import { UpdateUserPlayerAceDto } from './dto/update-user-player-ace.dto';

const include = Prisma.validator<Prisma.UserPlayerAccessControlEntryInclude>()({
  user: true,
  player: true,
});

@Injectable()
export class UserPlayerAclService {
  constructor(private readonly prisma: PrismaService) {}

  create(createAceDto: CreateUserPlayerAceDto) {
    return this.prisma.userPlayerAccessControlEntry.create({
      data: createAceDto,
      include,
    });
  }

  findAll() {
    return `This action returns all userPlayerAcl`;
  }

  findOne(id: string) {
    return this.prisma.userPlayerAccessControlEntry.findUnique({
      where: { id },
      include,
    });
  }

  update(id: string, updateAceDto: UpdateUserPlayerAceDto) {
    return this.prisma.userPlayerAccessControlEntry.update({
      where: { id },
      data: updateAceDto,
      include,
    });
  }

  remove(id: string) {
    return this.prisma.userPlayerAccessControlEntry.delete({
      where: { id },
      include,
    });
  }
}
