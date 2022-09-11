import { Transform } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
} from 'class-validator';

import { OrderStatusEnum } from '../types';

export class FindAllOrdersDto {
  @IsOptional()
  @IsInt()
  userId?: number;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'number' ? [value] : value))
  @IsArray()
  @IsInt({ each: true })
  playerIds?: number[];

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'number' ? [value] : value))
  @IsArray()
  @IsInt({ each: true })
  teamIds?: number[];

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'number' ? [value] : value))
  @IsArray()
  @IsInt({ each: true })
  matchIds?: number[];

  @IsOptional()
  @IsEnum(OrderStatusEnum, {
    message: `Status must be a valid enum value. Available values: ${Object.keys(
      OrderStatusEnum,
    ).join(', ')}`,
  })
  status?: OrderStatusEnum;

  @IsOptional()
  @IsDateString()
  createdAfter?: string;

  @IsOptional()
  @IsDateString()
  createdBefore?: string;
}
