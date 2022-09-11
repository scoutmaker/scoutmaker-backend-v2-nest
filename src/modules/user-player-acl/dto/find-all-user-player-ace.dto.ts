import { IsInt, IsOptional } from 'class-validator';

export class FindAllUserPlayerAceDto {
  @IsOptional()
  @IsInt()
  userId?: number;

  @IsOptional()
  @IsInt()
  playerId?: number;
}
