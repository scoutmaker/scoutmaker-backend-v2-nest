import { OmitType, PartialType } from '@nestjs/swagger';

import { CreateOrganizationSubscriptionDto } from './create-organization-subscription.dto';

export class UpdateOrganizationSubscriptionDto extends PartialType(
  OmitType(CreateOrganizationSubscriptionDto, ['organizationId']),
) {}
