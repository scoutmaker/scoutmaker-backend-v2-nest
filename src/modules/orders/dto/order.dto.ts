import { PickType } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform } from 'class-transformer';

import { MatchBasicDataDto } from '../../matches/dto/match.dto';
import {
  PlayerBasicDataDto,
  PlayerBasicDataWithoutTeamsDto,
} from '../../players/dto/player.dto';
import { UserBasicDataDto } from '../../users/dto/user.dto';
import { OrderStatusEnum } from '../types';

class OrderCount {
  reports: number;
}

export class OrderDto {
  @Expose()
  id: string;

  @Expose()
  status: OrderStatusEnum;

  @Expose()
  description?: string;

  @Expose()
  acceptDate?: Date;

  @Expose()
  closeDate?: Date;

  @Expose()
  createdAt: Date;

  @Transform(({ value }) =>
    plainToInstance(UserBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  author: UserBasicDataDto;

  @Transform(({ value }) =>
    plainToInstance(UserBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  scout?: UserBasicDataDto;

  @Transform(({ value }) =>
    plainToInstance(PlayerBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  player?: PlayerBasicDataDto;

  @Transform(({ value }) =>
    plainToInstance(MatchBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  match?: MatchBasicDataDto;

  @Expose()
  _count: OrderCount;
}

class PlayerSuperBasicInfoDto extends PickType(PlayerBasicDataWithoutTeamsDto, [
  'id',
  'firstName',
  'lastName',
]) {}

export class OrderBasicDataDto extends PickType(OrderDto, [
  'id',
  'match',
  'status',
  'createdAt',
]) {
  @Transform(({ value }) =>
    plainToInstance(PlayerSuperBasicInfoDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  player?: PlayerSuperBasicInfoDto;
}
