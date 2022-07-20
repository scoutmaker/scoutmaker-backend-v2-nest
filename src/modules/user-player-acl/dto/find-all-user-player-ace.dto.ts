import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class FindAllUserPlayerAceDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  userId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  playerId?: number;
}
