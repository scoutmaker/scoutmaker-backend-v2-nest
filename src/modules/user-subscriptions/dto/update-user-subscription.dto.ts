import { OmitType, PartialType } from '@nestjs/swagger';

import { CreateUserSubscriptionDto } from './create-user-subscription.dto';

export class UpdateUserSubscriptionDto extends PartialType(
  OmitType(CreateUserSubscriptionDto, ['userId']),
) {}
