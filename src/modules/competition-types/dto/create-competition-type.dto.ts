import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCompetitionTypeDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  name: string;
}
