import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { add } from 'date-fns';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { convertJwtExpiresInToNumber } from '../utils/helpers';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

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
    });
  }
}
