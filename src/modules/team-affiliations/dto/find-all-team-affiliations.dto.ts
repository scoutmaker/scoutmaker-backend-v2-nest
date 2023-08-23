import { IsOptional, IsString } from 'class-validator';

import { IsOptionalStringArray } from '../../../common/decorators/string-array-filter.decorator';

export class FindAllTeamAffiliationsDto {
  @IsOptional()
  @IsString()
  playerId?: string;

  @IsOptional()
  @IsString()
  teamId?: string;

  @IsOptionalStringArray()
  clubIds?: string[];

  @IsOptional()
  @IsString()
  date?: string;
}
