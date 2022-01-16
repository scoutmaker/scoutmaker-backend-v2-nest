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
import { CompetitionsService } from './competitions.service';
import { CompetitionDto } from './dto/competition.dto';
import { CreateCompetitionDto } from './dto/create-competition.dto';
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
  async findAll() {
    const competitions = await this.competitionsService.findAll();
    return formatSuccessResponse(
      'Successfully fetched all competitions',
      competitions,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.competitionsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCompetitionDto: UpdateCompetitionDto,
  ) {
    return this.competitionsService.update(+id, updateCompetitionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.competitionsService.remove(+id);
  }
}
