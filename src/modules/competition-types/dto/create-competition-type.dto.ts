import { IsRequiredStringWithMaxLength } from '../../../common/decorators/is-required-string-with-max-length.decorator';

export class CreateCompetitionTypeDto {
  @IsRequiredStringWithMaxLength(30)
  name: string;
}
