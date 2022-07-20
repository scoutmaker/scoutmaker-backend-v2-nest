import { PickType } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform } from 'class-transformer';

import { MatchBasicDataDto } from '../../matches/dto/match.dto';
import { PlayerBasicDataWithoutTeamsDto } from '../../players/dto/player.dto';
import { UserBasicDataDto } from '../../users/dto/user.dto';
import { OrderStatusEnum } from '../types';

export class OrderDto {
  @Expose()
  id: number;

  @Expose()
  docNumber: number;

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
    plainToInstance(PlayerBasicDataWithoutTeamsDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  player?: PlayerBasicDataWithoutTeamsDto;

  @Transform(({ value }) =>
    plainToInstance(MatchBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  match?: MatchBasicDataDto;
}

class PlayerSuperBasicInfoDto extends PickType(PlayerBasicDataWithoutTeamsDto, [
  'id',
  'firstName',
  'lastName',
]) {}

export class OrderBasicDataDto extends PickType(OrderDto, [
  'id',
  'docNumber',
  'match',
]) {
  @Transform(({ value }) =>
    plainToInstance(PlayerSuperBasicInfoDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  player?: PlayerSuperBasicInfoDto;
}
