import { IsOptional, IsString } from 'class-validator';

export class FindAllUserPlayerAceDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  playerId?: string;
}
