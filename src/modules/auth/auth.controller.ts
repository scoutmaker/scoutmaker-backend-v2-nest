import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { add } from 'date-fns';
import { CookieOptions, Request, Response } from 'express';

import { ApiResponse } from '../../api-response/api-response.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { formatSuccessResponse } from '../../utils/helpers';
import { UpdatePasswordDto } from '../users/dto/update-password.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { UserDto } from '../users/dto/user.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register-user.dto';

const cookieOptions: CookieOptions = {
  httpOnly: true,
  expires: add(new Date(), { days: 30 }),
};

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

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
    response.cookie('token', token, cookieOptions);
    return formatSuccessResponse('Successfully logged in', { user, expiresIn });
  }

  @Get('verify/:confirmationCode')
  @ApiResponse(UserDto, { type: 'read' })
  @Serialize(UserDto)
  async verify(@Param('confirmationCode') confirmationCode: string) {
    const user = await this.usersService.verify(confirmationCode);
    return formatSuccessResponse(
      'Account activated successfully, you can now log in to the app!',
      user,
    );
  }

  @Get('account')
  @ApiResponse(UserDto, { type: 'read' })
  @Serialize(UserDto)
  @UseGuards(AuthGuard)
  @ApiCookieAuth()
  async getAccount(@Req() request: Request) {
    const user = await this.usersService.findOne(request.user.id);
    return formatSuccessResponse('Successfully fetched account', user);
  }

  @Patch('update-account')
  @ApiResponse(UserDto, { type: 'update' })
  @Serialize(UserDto)
  @UseGuards(AuthGuard)
  @ApiCookieAuth()
  async updateAccount(
    @Req() request: Request,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.update(request.user.id, updateUserDto);
    return formatSuccessResponse('Account details updated successfully', user);
  }

  @Patch('update-password')
  @ApiResponse(UserDto, { type: 'update' })
  @Serialize(UserDto, 'user')
  @UseGuards(AuthGuard)
  @ApiCookieAuth()
  async updatePassword(
    @Req() request: Request,
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user, token, expiresIn } = await this.authService.updatePassword(
      request.user.id,
      updatePasswordDto,
    );
    response.cookie('token', token, cookieOptions);
    return formatSuccessResponse('Password updated successfully!', {
      user,
      expiresIn,
    });
  }
}
