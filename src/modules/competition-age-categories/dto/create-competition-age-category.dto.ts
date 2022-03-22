import { IsRequiredStringWithMaxLength } from '../../../decorators/is-required-string-with-max-length.decorator';

export class CreateCompetitionAgeCategoryDto {
  @IsRequiredStringWithMaxLength(30)
  name: string;
}
