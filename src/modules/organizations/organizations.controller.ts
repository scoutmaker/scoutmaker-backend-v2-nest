import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

import { ApiResponse } from '../../api-response/api-response.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { RoleGuard } from '../../guards/role.guard';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { formatSuccessResponse } from '../../utils/helpers';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { OrganizationDto } from './dto/organization.dto';
import { ToggleMembershipDto } from './dto/toggle-membership.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationsService } from './organizations.service';

@Controller('organizations')
@ApiTags('organizations')
@UseGuards(AuthGuard, new RoleGuard(['ADMIN']))
@ApiCookieAuth()
@Serialize(OrganizationDto)
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  @ApiResponse(OrganizationDto, { type: 'create' })
  async create(@Body() createOrganizationDto: CreateOrganizationDto) {
    const organization = await this.organizationsService.create(
      createOrganizationDto,
    );
    return formatSuccessResponse(
      'Successfully created new organization',
      organization,
    );
  }

  @Get()
  @ApiResponse(OrganizationDto, { type: 'read' })
  async findAll() {
    const organizations = await this.organizationsService.findAll();
    return formatSuccessResponse(
      'Successfully fetched all organizations',
      organizations,
    );
  }

  @Get(':id')
  @ApiResponse(OrganizationDto, { type: 'read' })
  async findOne(@Param('id') id: string) {
    const organization = await this.organizationsService.findOne(id);
    return formatSuccessResponse(
      `Successfully fetched organization ${id}`,
      organization,
    );
  }

  @Patch(':id')
  @ApiResponse(OrganizationDto, { type: 'update' })
  async update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    const organization = await this.organizationsService.update(
      id,
      updateOrganizationDto,
    );
    return formatSuccessResponse(
      `Successfully updated organization ${id}`,
      organization,
    );
  }

  @Patch(':id/add-member')
  @ApiResponse(OrganizationDto, { type: 'update' })
  async addMember(
    @Param('id') id: string,
    @Body() toggleMembershipDto: ToggleMembershipDto,
  ) {
    const organization = await this.organizationsService.addMember(
      id,
      toggleMembershipDto,
    );
    return formatSuccessResponse(
      `Successfully added member ${toggleMembershipDto.memberId} to organization ${id}`,
      organization,
    );
  }

  @Patch(':id/remove-member')
  @ApiResponse(OrganizationDto, { type: 'update' })
  async removeMember(
    @Param('id') id: string,
    @Body() toggleMembershipDto: ToggleMembershipDto,
  ) {
    const organization = await this.organizationsService.removeMember(
      id,
      toggleMembershipDto,
    );
    return formatSuccessResponse(
      `Successfully removed member ${toggleMembershipDto.memberId} from organization ${id}`,
      organization,
    );
  }

  @Delete(':id')
  @ApiResponse(OrganizationDto, { type: 'delete' })
  async remove(@Param('id') id: string) {
    const organization = await this.organizationsService.remove(id);
    return formatSuccessResponse(
      `Successfully removed organization ${id}`,
      organization,
    );
  }
}
