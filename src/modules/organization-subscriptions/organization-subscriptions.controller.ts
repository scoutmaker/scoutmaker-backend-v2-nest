import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrganizationSubscriptionsService } from './organization-subscriptions.service';
import { CreateOrganizationSubscriptionDto } from './dto/create-organization-subscription.dto';
import { UpdateOrganizationSubscriptionDto } from './dto/update-organization-subscription.dto';

@Controller('organization-subscriptions')
export class OrganizationSubscriptionsController {
  constructor(private readonly organizationSubscriptionsService: OrganizationSubscriptionsService) {}

  @Post()
  create(@Body() createOrganizationSubscriptionDto: CreateOrganizationSubscriptionDto) {
    return this.organizationSubscriptionsService.create(createOrganizationSubscriptionDto);
  }

  @Get()
  findAll() {
    return this.organizationSubscriptionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationSubscriptionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrganizationSubscriptionDto: UpdateOrganizationSubscriptionDto) {
    return this.organizationSubscriptionsService.update(+id, updateOrganizationSubscriptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationSubscriptionsService.remove(+id);
  }
}
