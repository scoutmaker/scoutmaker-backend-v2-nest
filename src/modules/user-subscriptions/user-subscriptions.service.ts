import { Injectable } from '@nestjs/common';
import { CreateUserSubscriptionDto } from './dto/create-user-subscription.dto';
import { UpdateUserSubscriptionDto } from './dto/update-user-subscription.dto';

@Injectable()
export class UserSubscriptionsService {
  create(createUserSubscriptionDto: CreateUserSubscriptionDto) {
    return 'This action adds a new userSubscription';
  }

  findAll() {
    return `This action returns all userSubscriptions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userSubscription`;
  }

  update(id: number, updateUserSubscriptionDto: UpdateUserSubscriptionDto) {
    return `This action updates a #${id} userSubscription`;
  }

  remove(id: number) {
    return `This action removes a #${id} userSubscription`;
  }
}
