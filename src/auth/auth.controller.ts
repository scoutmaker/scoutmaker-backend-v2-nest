import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponse } from '../utils/api-response/api-response.decorator';
import { formatSuccessResponse } from '../utils/helpers';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserDto } from '../users/dto/user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';

@Controller('auth')
@ApiTags('auth')
@Serialize(UserDto)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiResponse(UserDto, { type: 'create' })
  async register(@Body() registerUserDto: RegisterUserDto) {
    const user = await this.authService.register(registerUserDto);
    return formatSuccessResponse(
      'Account created successfully! Please check your email to verify your account.',
      user,
    );
  }
}
