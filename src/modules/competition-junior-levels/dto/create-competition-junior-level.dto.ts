import {
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  Min,
  Max,
} from 'class-validator';

export class CreateCompetitionJuniorLevelDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  name: string;

  @IsInt()
  @Min(1)
  @Max(15)
  level: number;
}
