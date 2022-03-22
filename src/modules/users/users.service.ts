import { Injectable } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const include: Prisma.UserInclude = {
  region: { include: { country: true } },
  footballRole: true,
  club: true,
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({ include });
  }

  getList() {
    return this.prisma.user.findMany();
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id }, include });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      include,
    });
  }

  updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    return this.prisma.user.update({
      where: { id },
      data: {
        password: updatePasswordDto.newPassword,
      },
    });
  }

  verify(confirmationCode: string) {
    return this.prisma.user.update({
      where: { confirmationCode },
      data: {
        status: 'ACTIVE',
        confirmationCode: null,
        confirmationCodeExpiryDate: null,
      },
    });
  }

  changeRole(id: string, role: UserRole) {
    return this.prisma.user.update({
      where: { id },
      data: { role },
    });
  }
}
