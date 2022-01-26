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
import { CompetitionJuniorLevelsService } from './competition-junior-levels.service';
import { CompetitionJuniorLevelDto } from './dto/competition-junior-level.dto';
import { CreateCompetitionJuniorLevelDto } from './dto/create-competition-junior-level.dto';
import { UpdateCompetitionJuniorLevelDto } from './dto/update-competition-junior-level.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { RoleGuard } from '../../guards/role.guard';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { ApiResponse } from '../../api-response/api-response.decorator';
import { formatSuccessResponse } from '../../utils/helpers';

@Controller('competition-junior-levels')
@ApiTags('competition junior levels')
@UseGuards(AuthGuard, new RoleGuard(['ADMIN']))
@ApiCookieAuth()
@Serialize(CompetitionJuniorLevelDto)
export class CompetitionJuniorLevelsController {
  constructor(
    private readonly juniorLevelsService: CompetitionJuniorLevelsService,
  ) {}

  @Post()
  @ApiResponse(CompetitionJuniorLevelDto, { type: 'create' })
  async create(
    @Body() createCompetitionJuniorLevelDto: CreateCompetitionJuniorLevelDto,
  ) {
    const juniorLevel = await this.juniorLevelsService.create(
      createCompetitionJuniorLevelDto,
    );
    return formatSuccessResponse(
      `Successfully created new junior level`,
      juniorLevel,
    );
  }

  @Get()
  @ApiResponse(CompetitionJuniorLevelDto, { type: 'read', isArray: true })
  async findAll() {
    const juniorLevels = await this.juniorLevelsService.findAll();
    return formatSuccessResponse(
      `Successfully fetched all junior levels`,
      juniorLevels,
    );
  }

  @Get(':id')
  @ApiResponse(CompetitionJuniorLevelDto, { type: 'read' })
  async findOne(@Param('id') id: string) {
    const juniorLevel = await this.juniorLevelsService.findOne(id);
    return formatSuccessResponse(
      `Successfully fetched junior level with the id of ${id}`,
      juniorLevel,
    );
  }

  @Patch(':id')
  @ApiResponse(CompetitionJuniorLevelDto, { type: 'update' })
  async update(
    @Param('id') id: string,
    @Body() updateCompetitionJuniorLevelDto: UpdateCompetitionJuniorLevelDto,
  ) {
    const juniorLevel = await this.juniorLevelsService.update(
      id,
      updateCompetitionJuniorLevelDto,
    );
    return formatSuccessResponse(
      `Successfully updated junior level with the id of ${id}`,
      juniorLevel,
    );
  }

  @Delete(':id')
  @ApiResponse(CompetitionJuniorLevelDto, { type: 'delete' })
  async remove(@Param('id') id: string) {
    const juniorLevel = await this.juniorLevelsService.remove(id);
    return formatSuccessResponse(
      `Successfully deleted junior level with the id of ${id}`,
      juniorLevel,
    );
  }
}
