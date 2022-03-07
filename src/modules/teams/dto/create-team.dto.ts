import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, IsUrl } from 'class-validator';

import { IsCuid } from '../../../decorators/is-cuid.decorator';
import { IsRequiredStringWithMaxLength } from '../../../decorators/is-required-string-with-max-length.decorator';

export class CreateTeamDto {
  @IsRequiredStringWithMaxLength(30)
  name: string;

  @IsCuid()
  clubId: string;

  @IsCuid()
  competitionId: string;

  @IsOptional()
  @IsCuid()
  groupId?: string;

  @IsOptional()
  @IsUrl()
  minut90url?: string;

  @IsOptional()
  @IsUrl()
  transfermarktUrl?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  lnpId?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
