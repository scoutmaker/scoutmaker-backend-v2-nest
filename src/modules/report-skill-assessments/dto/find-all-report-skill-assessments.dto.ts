import { IsOptional } from 'class-validator';

import { IsCuid } from '../../../decorators/is-cuid.decorator';

export class FindAllReportSkillAssessmentsDto {
  @IsOptional()
  @IsCuid()
  playerId?: string;

  @IsOptional()
  @IsCuid()
  matchId?: string;
}
