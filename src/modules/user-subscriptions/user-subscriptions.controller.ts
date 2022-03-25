import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserSubscriptionsService } from './user-subscriptions.service';
import { CreateUserSubscriptionDto } from './dto/create-user-subscription.dto';
import { UpdateUserSubscriptionDto } from './dto/update-user-subscription.dto';

@Controller('user-subscriptions')
export class UserSubscriptionsController {
  constructor(private readonly userSubscriptionsService: UserSubscriptionsService) {}

  @Post()
  create(@Body() createUserSubscriptionDto: CreateUserSubscriptionDto) {
    return this.userSubscriptionsService.create(createUserSubscriptionDto);
  }

  @Get()
  findAll() {
    return this.userSubscriptionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userSubscriptionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserSubscriptionDto: UpdateUserSubscriptionDto) {
    return this.userSubscriptionsService.update(+id, updateUserSubscriptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userSubscriptionsService.remove(+id);
  }
}
