import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, IsUrl } from 'class-validator';

import { IsRequiredStringWithMaxLength } from '../../../common/decorators/is-required-string-with-max-length.decorator';

export class CreateTeamDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsRequiredStringWithMaxLength(50)
  name: string;

  @IsString()
  clubId: string;

  @IsOptional()
  @IsString()
  competitionId?: string;

  @IsOptional()
  @IsString()
  groupId?: string;

  @IsOptional()
  @IsUrl()
  minut90url?: string;

  @IsOptional()
  @IsUrl()
  transfermarktUrl?: string;

  @IsOptional()
  @IsString()
  scoutmakerv1Id?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  lnpId?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
