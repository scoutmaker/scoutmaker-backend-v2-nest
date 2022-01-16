import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { ApiResponse } from '../../api-response/api-response.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { RoleGuard } from '../../guards/role.guard';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { formatSuccessResponse } from '../../utils/helpers';
import { CompetitionsService } from './competitions.service';
import { CompetitionDto } from './dto/competition.dto';
import { CreateCompetitionDto } from './dto/create-competition.dto';
import { FindAllCompetitionsDto } from './dto/find-all-competitions.dto';
import { UpdateCompetitionDto } from './dto/update-competition.dto';

@Controller('competitions')
@ApiTags('competitions')
@UseGuards(AuthGuard, new RoleGuard(['ADMIN']))
@ApiCookieAuth()
@Serialize(CompetitionDto)
export class CompetitionsController {
  constructor(private readonly competitionsService: CompetitionsService) {}

  @Post()
  @ApiResponse(CompetitionDto, { type: 'create' })
  async create(@Body() createCompetitionDto: CreateCompetitionDto) {
    const competition = await this.competitionsService.create(
      createCompetitionDto,
    );
    return formatSuccessResponse(
      'Successfully created new competition',
      competition,
    );
  }

  @Get()
  @ApiResponse(CompetitionDto, { type: 'read' })
  async findAll(@Query() query: FindAllCompetitionsDto) {
    const competitions = await this.competitionsService.findAll(query);
    return formatSuccessResponse(
      'Successfully fetched all competitions',
      competitions,
    );
  }

  @Get(':id')
  @ApiResponse(CompetitionDto, { type: 'read' })
  async findOne(@Param('id') id: string) {
    const competition = await this.competitionsService.findOne(id);
    return formatSuccessResponse(
      `Successfully fetched competition with the id of ${id}`,
      competition,
    );
  }

  @Patch(':id')
  @ApiResponse(CompetitionDto, { type: 'update' })
  async update(
    @Param('id') id: string,
    @Body() updateCompetitionDto: UpdateCompetitionDto,
  ) {
    const competition = await this.competitionsService.update(
      id,
      updateCompetitionDto,
    );
    return formatSuccessResponse(
      `Successfully updated competition with the id of ${id}`,
      competition,
    );
  }

  @Delete(':id')
  @ApiResponse(CompetitionDto, { type: 'delete' })
  async remove(@Param('id') id: string) {
    const competition = await this.competitionsService.remove(id);
    return formatSuccessResponse(
      `Successfully deleted competition with the id of ${id}`,
      competition,
    );
  }
}
