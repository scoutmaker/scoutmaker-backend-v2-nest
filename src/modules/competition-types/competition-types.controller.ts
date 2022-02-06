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
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { ApiResponse } from '../../api-response/api-response.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { RoleGuard } from '../../guards/role.guard';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { formatSuccessResponse } from '../../utils/helpers';
import { CompetitionTypesService } from './competition-types.service';
import { CompetitionTypeDto } from './dto/competition-type.dto';
import { CreateCompetitionTypeDto } from './dto/create-competition-type.dto';
import { UpdateCompetitionTypeDto } from './dto/update-competition-type.dto';

@Controller('competition-types')
@ApiTags('competition types')
@UseGuards(AuthGuard, new RoleGuard(['ADMIN']))
@ApiCookieAuth()
@Serialize(CompetitionTypeDto)
export class CompetitionTypesController {
  constructor(private readonly typesService: CompetitionTypesService) {}

  @Post()
  @ApiResponse(CompetitionTypeDto, { type: 'create' })
  async create(@Body() createCompetitionTypeDto: CreateCompetitionTypeDto) {
    const type = await this.typesService.create(createCompetitionTypeDto);
    return formatSuccessResponse(
      'Successfully created new competition type',
      type,
    );
  }

  @Get()
  @ApiResponse(CompetitionTypeDto, { type: 'read', isArray: true })
  async findAll() {
    const types = await this.typesService.findAll();
    return formatSuccessResponse(
      'Successfully fetched all competition types',
      types,
    );
  }

  @Get(':id')
  @ApiResponse(CompetitionTypeDto, { type: 'read' })
  async findOne(@Param('id') id: string) {
    const type = await this.typesService.findOne(id);
    return formatSuccessResponse(
      `Successfully fetched competition type with the id of ${id}`,
      type,
    );
  }

  @Patch(':id')
  @ApiResponse(CompetitionTypeDto, { type: 'update' })
  async update(
    @Param('id') id: string,
    @Body() updateCompetitionTypeDto: UpdateCompetitionTypeDto,
  ) {
    const type = await this.typesService.update(id, updateCompetitionTypeDto);
    return formatSuccessResponse(
      `Successfully updated competition type with the id of ${id}`,
      type,
    );
  }

  @Delete(':id')
  @ApiResponse(CompetitionTypeDto, { type: 'delete' })
  async remove(@Param('id') id: string) {
    const type = await this.typesService.remove(id);
    return formatSuccessResponse(
      `Successfully deleted competition type with the id of ${id}`,
      type,
    );
  }
}
