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
import { formatSuccessResponse } from 'src/utils/helpers';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ApiResponse } from '../utils/api-response/api-response.decorator';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
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
