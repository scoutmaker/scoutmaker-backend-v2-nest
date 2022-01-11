import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationOptionsDto {
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  @ApiProperty({ type: 'string' })
  sortingOrder?: 'asc' | 'desc';

  @IsOptional()
  @IsNumber()
  @Min(2)
  limit?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;
}
