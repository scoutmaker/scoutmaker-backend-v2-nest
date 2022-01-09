import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { add } from 'date-fns';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';
import { UserDto } from '../users/dto/user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ApiResponse } from '../utils/api-response/api-response.decorator';
import { formatSuccessResponse } from '../utils/helpers';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiResponse(UserDto, { type: 'create' })
  @Serialize(UserDto)
  async register(@Body() registerUserDto: RegisterUserDto) {
    const user = await this.authService.register(registerUserDto);
    return formatSuccessResponse(
      'Account created successfully! Please check your email to verify your account.',
      user,
    );
  }

  @Post('login')
  @ApiResponse(UserDto, { type: 'read' })
  @Serialize(UserDto, 'user')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user, token, expiresIn } = await this.authService.login(loginDto);
    response.cookie('token', token, {
      httpOnly: true,
      expires: add(new Date(), { days: 30 }),
    });
    return formatSuccessResponse('Successfully logged in', { user, expiresIn });
  }
}
