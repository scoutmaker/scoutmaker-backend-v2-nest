import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationOptionsDto } from '../../pagination/pagination-options.dto';

export class CountriesPaginationOptionDto extends PaginationOptionsDto {
  @IsOptional()
  @IsString()
  @IsEnum(['name', 'code', 'isEuMember'])
  @ApiProperty({ type: 'string' })
  sortBy?: 'name' | 'code' | 'isEuMember';
}
