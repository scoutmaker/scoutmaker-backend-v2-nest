import { PaginatedData } from '../common/api-response/api-paginated-response.dto';
import { ApiResponseDto } from '../common/api-response/api-response.dto';

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

export function calculateSkip(page: number, limit: number) {
  return (page - 1) * limit;
}

export function calculatePercentage(value: number, base: number) {
  return parseFloat(((value / base) * 100).toFixed(2));
}

export function calculateAvg(array: number[]) {
  return parseFloat(
    (array.reduce((a, b) => a + b, 0) / array.length).toFixed(2),
  );
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

export function formatSortingEnumErrorMessage(
  availableEnum: Record<string, unknown>,
) {
  return `Available sorting options are ${Object.keys(availableEnum).join(
    ', ',
  )}`;
}

export function isIdsArrayFilterDefined(ids: string[] | undefined) {
  return ids && ids.length > 0;
}
