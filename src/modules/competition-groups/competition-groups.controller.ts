import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiCookieAuth } from '@nestjs/swagger';
import { ApiResponse } from '../../api-response/api-response.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { formatSuccessResponse } from '../../utils/helpers';
import { CompetitionGroupsService } from './competition-groups.service';
import { CompetitionGroupDto } from './dto/competition-group.dto';
import { CreateCompetitionGroupDto } from './dto/create-competition-group.dto';
import { UpdateCompetitionGroupDto } from './dto/update-competition-group.dto';

@Controller('competition-groups')
@ApiTags('competition groups')
@UseGuards(AuthGuard)
@ApiCookieAuth()
@Serialize(CompetitionGroupDto)
export class CompetitionGroupsController {
  constructor(private readonly groupsService: CompetitionGroupsService) {}

  @Post()
  @ApiResponse(CompetitionGroupDto, { type: 'create' })
  async create(@Body() createCompetitionGroupDto: CreateCompetitionGroupDto) {
    const group = await this.groupsService.create(createCompetitionGroupDto);
    return formatSuccessResponse(
      'Successfully created new competition group',
      group,
    );
  }

  @Get()
  @ApiResponse(CompetitionGroupDto, { type: 'read', isArray: true })
  async findAll() {
    const groups = await this.groupsService.findAll();
    return formatSuccessResponse(
      'Successfully fetched all competition groups',
      groups,
    );
  }

  @Get(':id')
  @ApiResponse(CompetitionGroupDto, { type: 'read' })
  async findOne(@Param('id') id: string) {
    const group = await this.groupsService.findOne(id);
    return formatSuccessResponse(
      `Successfully fetched competition group with the id of ${id}`,
      group,
    );
  }

  @Patch(':id')
  @ApiResponse(CompetitionGroupDto, { type: 'update' })
  async update(
    @Param('id') id: string,
    @Body() updateCompetitionGroupDto: UpdateCompetitionGroupDto,
  ) {
    const group = await this.groupsService.update(
      id,
      updateCompetitionGroupDto,
    );
    return formatSuccessResponse(
      `Successfully updated competition group with the id of ${id}`,
      group,
    );
  }

  @Delete(':id')
  @ApiResponse(CompetitionGroupDto, { type: 'delete' })
  async remove(@Param('id') id: string) {
    const group = await this.groupsService.remove(id);
    return formatSuccessResponse(
      `Successfully deleted competition group with the id of ${id}`,
      group,
    );
  }
}
