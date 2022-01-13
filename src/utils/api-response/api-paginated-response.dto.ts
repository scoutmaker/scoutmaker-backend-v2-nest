import { ApiHideProperty } from '@nestjs/swagger';

export class PaginatedData<Data> {
  @ApiHideProperty()
  docs: Data[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export class ApiPaginatedResponseDto<Data> {
  success: boolean;
  message: string;

  @ApiHideProperty()
  data: PaginatedData<Data>;
}
