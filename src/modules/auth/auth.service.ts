import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { add } from 'date-fns';
import * as jwt from 'jsonwebtoken';
import { I18nService } from 'nestjs-i18n';

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
    private readonly i18n: I18nService,
  ) {}

  private getAndVerifyJwt(id: string, role: UserRole, organizationId: string) {
    const token = jwt.sign(
      { id, role, organizationId },
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

  async login({ email, password }: LoginDto, lang: string) {
    const invalidCredentialsMessage = await this.i18n.translate(
      'auth.INVALID_CREDENTIALS_ERROR',
      { lang },
    );
    // Check if the user with the given email exists
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException(invalidCredentialsMessage);
    }

    // Check if the user is verified and not blocked
    if (user.status !== 'ACTIVE') {
      const accountNotActiveMessage = await this.i18n.translate(
        'auth.ACCOUNT_NOT_ACTIVE_ERROR',
        { lang },
      );
      throw new UnauthorizedException(accountNotActiveMessage);
    }

    // Password comparison
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(invalidCredentialsMessage);
    }

    // Generate token
    const { id, role, organizationId } = user;
    const { token, expiresIn } = this.getAndVerifyJwt(id, role, organizationId);

    return {
      user,
      token,
      expiresIn,
    };
  }

  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.usersService.updatePassword(id, updatePasswordDto);

    const { role, organizationId } = user;
    const { token, expiresIn } = this.getAndVerifyJwt(id, role, organizationId);

    return { user, token, expiresIn };
  }
}
