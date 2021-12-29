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
