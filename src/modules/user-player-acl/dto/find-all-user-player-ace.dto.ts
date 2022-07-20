import { IsInt, IsOptional } from 'class-validator';

export class FindAllUserPlayerAceDto {
  @IsOptional()
  @IsInt()
  userId?: string;

  @IsOptional()
  @IsInt()
  playerId?: string;
}
