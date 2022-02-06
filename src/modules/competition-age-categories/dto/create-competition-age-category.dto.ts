import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCompetitionAgeCategoryDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  name: string;
}
