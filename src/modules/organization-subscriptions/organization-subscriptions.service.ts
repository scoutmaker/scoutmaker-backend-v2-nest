import { Injectable } from '@nestjs/common';
import { CreateOrganizationSubscriptionDto } from './dto/create-organization-subscription.dto';
import { UpdateOrganizationSubscriptionDto } from './dto/update-organization-subscription.dto';

@Injectable()
export class OrganizationSubscriptionsService {
  create(createOrganizationSubscriptionDto: CreateOrganizationSubscriptionDto) {
    return 'This action adds a new organizationSubscription';
  }

  findAll() {
    return `This action returns all organizationSubscriptions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} organizationSubscription`;
  }

  update(id: number, updateOrganizationSubscriptionDto: UpdateOrganizationSubscriptionDto) {
    return `This action updates a #${id} organizationSubscription`;
  }

  remove(id: number) {
    return `This action removes a #${id} organizationSubscription`;
  }
}
