import { IsEnum } from 'class-validator';

import { OrderStatusEnum } from '../types';

export class ChangeOrderStatusDto {
  @IsEnum(OrderStatusEnum, {
    message: `Footed must be a valid enum value. Available values: ${Object.keys(
      OrderStatusEnum,
    ).join(', ')}`,
  })
  footed: OrderStatusEnum;
}
