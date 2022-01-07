import { ApiResponseDto } from './api-response/api-response.dto';

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
