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
  userId?: string;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  @IsArray()
  @IsInt({ each: true })
  playerIds?: string[];

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  @IsArray()
  @IsInt({ each: true })
  teamIds?: string[];

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  @IsArray()
  @IsInt({ each: true })
  matchIds?: string[];

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
