import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';

export enum SortingOrder {
  asc = 'asc',
  desc = 'desc',
}

export class PaginationOptionsDto {
  @IsOptional()
  @IsEnum(SortingOrder, { message: 'Sorting order must be "asc" or "desc"' })
  sortingOrder?: SortingOrder;

  @IsOptional()
  @IsNumber()
  @Min(2)
  limit?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;
}
