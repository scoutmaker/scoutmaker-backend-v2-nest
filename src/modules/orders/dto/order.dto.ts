import { OrderStatus } from '@prisma/client';
import { Expose, plainToInstance, Transform } from 'class-transformer';

import { MatchBasicDataDto } from '../../matches/dto/match.dto';
import { PlayerBasicDataWithoutTeamsDto } from '../../players/dto/player.dto';
import { UserBasicDataDto } from '../../users/dto/user.dto';

export class OrderDto {
  @Expose()
  id: string;

  @Expose()
  docNumber: number;

  @Expose()
  status: OrderStatus;

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
