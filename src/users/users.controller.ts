import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { formatSuccessResponse } from 'src/utils/helpers';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ApiResponse } from '../utils/api-response/api-response.decorator';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
@UseGuards(AuthGuard)
@ApiCookieAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiResponse(UserDto, { type: 'read', isArray: true })
  @Serialize(UserDto)
  async findAll() {
    const users = await this.usersService.findAll();
    return formatSuccessResponse('Successfully fetched all users', users);
  }
}
