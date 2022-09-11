import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, IsUrl } from 'class-validator';

import { IsRequiredStringWithMaxLength } from '../../../common/decorators/is-required-string-with-max-length.decorator';

export class CreateTeamDto {
  @IsRequiredStringWithMaxLength(30)
  name: string;

  @IsInt()
  clubId: number;

  @IsInt()
  competitionId: number;

  @IsOptional()
  @IsInt()
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
