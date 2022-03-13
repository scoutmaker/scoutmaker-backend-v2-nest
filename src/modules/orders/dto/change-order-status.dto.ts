import { IsEnum } from 'class-validator';

import { OrderStatusEnum } from '../types';

export class ChangeOrderStatusDto {
  @IsEnum(OrderStatusEnum, {
    message: `Status must be a valid enum value. Available values: ${Object.keys(
      OrderStatusEnum,
    ).join(', ')}`,
  })
  status: OrderStatusEnum;
}
