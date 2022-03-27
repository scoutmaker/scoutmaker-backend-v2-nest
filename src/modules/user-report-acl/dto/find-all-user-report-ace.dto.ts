import { IsOptional } from 'class-validator';

import { IsCuid } from '../../../decorators/is-cuid.decorator';

export class FindAllUserReportAceDto {
  @IsOptional()
  @IsCuid()
  userId?: string;

  @IsOptional()
  @IsCuid()
  reportId?: string;
}
