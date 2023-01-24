import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import * as jwt from 'jsonwebtoken';

import { CurrentUserDto } from '../../modules/users/dto/current-user.dto';
import { UsersService } from '../../modules/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.headers['x-auth-token'];

    if (!token) {
      return false;
    }

    const decodedUser = jwt.verify(
      token,
      this.configService.get('JWT_SECRET'),
    ) as CurrentUserDto;

    const user = await this.usersService.findCurrentWithCache(decodedUser.id);

    request.user = user;
    return true;
  }
}
