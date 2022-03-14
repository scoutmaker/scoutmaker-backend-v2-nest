import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { add } from 'date-fns';
import * as jwt from 'jsonwebtoken';

import { convertJwtExpiresInToNumber } from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePasswordDto } from '../users/dto/update-password.dto';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register-user.dto';

const include: Prisma.UserInclude = {
  region: { include: { country: true } },
  footballRole: true,
  club: true,
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  private getAndVerifyJwt(id: string, role: UserRole) {
    const token = jwt.sign(
      { id, role },
      this.configService.get<string>('JWT_SECRET'),
      {
        expiresIn: this.configService.get<string>('JWT_EXPIRE'),
      },
    );

    const decoded = jwt.verify(
      token,
      this.configService.get<string>('JWT_SECRET'),
    );

    return {
      token,
      expiresIn: typeof decoded !== 'string' ? decoded.exp : null,
    };
  }

  register(registerUserDto: RegisterUserDto) {
    // Filter out passwordConfirm from registerUserDto
    const { passwordConfirm, ...rest } = registerUserDto;

    // Get expiresIn value from env variable
    const expiresIn = this.configService.get<string>('JWT_EXPIRE');

    // Generate confirmation code
    const confirmationCode = jwt.sign(
      { email: rest.email },
      this.configService.get('JWT_SECRET'),
      { expiresIn },
    );

    // Calculate confirmation code expiry date
    const confirmationCodeExpiryDate = add(new Date(), {
      days: convertJwtExpiresInToNumber(expiresIn),
    });

    return this.prisma.user.create({
      data: { ...rest, confirmationCode, confirmationCodeExpiryDate },
      include,
    });
  }

  async login({ email, password }: LoginDto) {
    // Check if the user with the given email exists
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if the user is verified and not blocked
    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException(
        'Your account is not active, please verify your email',
      );
    }

    // Password comparison
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate token
    const { id, role } = user;
    const { token, expiresIn } = this.getAndVerifyJwt(id, role);

    return {
      user,
      token,
      expiresIn,
    };
  }

  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.usersService.updatePassword(id, updatePasswordDto);

    const { role } = user;
    const { token, expiresIn } = this.getAndVerifyJwt(id, role);

    return { user, token, expiresIn };
  }
}
