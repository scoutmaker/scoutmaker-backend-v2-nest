import { ApiResponseDto, PaginatedData } from './api-response/api-response.dto';
import { PaginationOptionsDto } from '../pagination/pagination-options.dto';

export function formatSuccessResponse<Data>(
  message: string,
  data: Data,
): ApiResponseDto<Data> {
  return {
    success: true,
    message,
    data,
  };
}

export function convertJwtExpiresInToNumber(expiresIn: string): number {
  return parseInt(
    expiresIn
      .split('')
      .filter((item) => !isNaN(parseInt(item)))
      .join(''),
    10,
  );
}

export function transformPaginationOptions({
  limit,
  page,
  sortBy,
  sortingOrder,
}: PaginationOptionsDto) {
  return {
    take: limit,
    orderBy: { [sortBy]: sortingOrder },
    skip: (page - 1) * limit,
  };
}

export type PaginatedResponseArgs<T> = {
  docs: T[];
  totalDocs: number;
  limit: number;
  page: number;
};

export function formatPaginatedResponse<T>({
  docs,
  totalDocs,
  limit,
  page,
}: PaginatedResponseArgs<T>): PaginatedData<T> {
  const totalPages = Math.ceil(totalDocs / limit);
  const hasPrevPage = page > 1;
  const hasNextPage = page < totalPages;

  return {
    docs,
    totalDocs,
    limit,
    totalPages,
    page,
    hasPrevPage,
    hasNextPage,
    prevPage: hasPrevPage ? page - 1 : null,
    nextPage: hasNextPage ? page + 1 : null,
  };
}
