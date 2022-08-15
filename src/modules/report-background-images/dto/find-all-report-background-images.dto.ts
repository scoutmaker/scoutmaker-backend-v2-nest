import { IsOptional, IsString } from 'class-validator';

export class FindAllReportBackgroundImagesDto {
  @IsOptional()
  @IsString()
  name?: string;
}
