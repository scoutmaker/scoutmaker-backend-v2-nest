import { ApiHideProperty } from '@nestjs/swagger';

export class ApiResponseDto<Data> {
  success: boolean;
  message: string;

  @ApiHideProperty()
  data: Data;
}
