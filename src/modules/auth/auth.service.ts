import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
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
import { AccountCreatedEvent } from './events/account-created.event';
import { PasswordResetRequestedEvent } from './events/password-reset-requested.event';

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
    private readonly eventEmitter: EventEmitter2,
  ) {}

  getAndVerifyJwt(id: string, role: UserRole, organizationId: string) {
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

  async register(registerUserDto: RegisterUserDto, lang: string) {
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

    const user = await this.prisma.user.create({
      data: { ...rest, confirmationCode, confirmationCodeExpiryDate },
      include,
    });

    const confirmationUrl = `${this.configService.get<string>(
      'CLIENT_URL',
    )}/account-confirm/${confirmationCode}`;

    // Dispatch account created event
    this.eventEmitter.emit(
      'account.created',
      new AccountCreatedEvent(
        {
          email: rest.email,
          userName: rest.firstName,
          confirmationUrl,
        },
        lang,
      ),
    );

    return user;
  }

  async login({ email, password }: LoginDto, lang: string) {
    const invalidCredentialsMessage = this.i18n.translate(
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
      const accountNotActiveMessage = this.i18n.translate(
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

  async forgotPassword(email: string, lang: string) {
    // Check if account with the given email exists
    let user = await this.usersService.findByEmail(email);

    const accountNotFoundMessage = this.i18n.translate(
      'auth.EMAIL_ACCOUNT_NOT_FOUND_ERROR',
      { lang },
    );

    if (!user) {
      throw new BadRequestException(accountNotFoundMessage);
    }

    // Get expiresIn value from env variable
    const expiresIn = this.configService.get<string>(
      'RESET_PASSWORD_JWT_EXPIRE',
    );

    // Generate confirmation code
    const resetPasswordToken = jwt.sign(
      { id: user.id },
      this.configService.get<string>('RESET_PASSWORD_JWT_SECRET'),
      { expiresIn },
    );

    // Calculate confirmation code expiry date
    const resetPasswordExpiryDate = add(new Date(), {
      days: convertJwtExpiresInToNumber(expiresIn),
    });

    // Save these values to a database
    user = await this.prisma.user.update({
      where: { id: user.id },
      data: { resetPasswordToken, resetPasswordExpiryDate },
    });

    // Generate password reset URL
    const resetPasswordUrl = `${this.configService.get<string>(
      'CLIENT_URL',
    )}/password-reset/${resetPasswordToken}`;

    // Dispatch password reset requested event
    this.eventEmitter.emit(
      'password-reset.requested',
      new PasswordResetRequestedEvent(
        {
          email,
          userName: user.firstName,
          resetPasswordUrl,
        },
        lang,
      ),
    );

    return user;
  }
}
