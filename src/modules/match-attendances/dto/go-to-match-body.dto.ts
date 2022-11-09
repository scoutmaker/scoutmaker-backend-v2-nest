import { IsEnum } from 'class-validator';

import { ObservationTypeEnum } from '../../../types/common';

export class GoToMatchBodyDto {
  @IsEnum(ObservationTypeEnum, {
    message: `Observation type must be a valid enum value. Available values: ${Object.keys(
      ObservationTypeEnum,
    ).join(', ')}`,
  })
  observationType: ObservationTypeEnum;
}
