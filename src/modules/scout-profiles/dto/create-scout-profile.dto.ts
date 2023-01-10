import { Transform } from 'class-transformer';
import { IsDate, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateScoutProfileDto {
  @IsString()
  userId: string;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  cooperationStartDate?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(4)
  rating?: number;
}
