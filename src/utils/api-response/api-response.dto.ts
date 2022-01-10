import { ApiHideProperty } from '@nestjs/swagger';

export class ApiResponseDto<Data> {
  success: boolean;
  message: string;

  @ApiHideProperty()
  data: Data;
}

export class PaginatedData<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}
