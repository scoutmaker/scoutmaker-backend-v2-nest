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
import { ApiResponseDto } from '../utils/api-response/api-response.dto';
import { UserEntity } from '../users/entities/user.entity';
import { ApiResponse } from '../utils/api-response/api-response.decorator';
import { formatSuccessResponse } from '../utils/helpers';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';

type SingleUserResponse = ApiResponseDto<UserEntity>;

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiResponse(UserEntity, { type: 'create' })
  async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<SingleUserResponse> {
    const user = await this.authService.register(registerUserDto);
    return formatSuccessResponse(
      'Account created successfully! Please check your email to verify your account.',
      user,
    );
  }
}
