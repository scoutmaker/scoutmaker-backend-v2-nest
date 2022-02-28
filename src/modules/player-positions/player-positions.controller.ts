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
import { PlayerPositionsService } from './player-positions.service';
import { PlayerPositionDto } from './dto/player-position.dto';
import { CreatePlayerPositionDto } from './dto/create-player-position.dto';
import { UpdatePlayerPositionDto } from './dto/update-player-position.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { ApiResponse } from '../../api-response/api-response.decorator';
import { formatSuccessResponse } from '../../utils/helpers';

@Controller('player-positions')
@ApiTags('player positions')
@UseGuards(AuthGuard)
@ApiCookieAuth()
@Serialize(PlayerPositionDto)
export class PlayerPositionsController {
  constructor(private readonly positionsService: PlayerPositionsService) {}

  @Post()
  @ApiResponse(PlayerPositionDto, { type: 'create' })
  async create(@Body() createPlayerPositionDto: CreatePlayerPositionDto) {
    const position = await this.positionsService.create(
      createPlayerPositionDto,
    );
    return formatSuccessResponse(
      'Successfully created new player position',
      position,
    );
  }

  @Get()
  @ApiResponse(PlayerPositionDto, { type: 'read', isArray: true })
  async findAll() {
    const positions = await this.positionsService.findAll();
    return formatSuccessResponse(
      'Successfully fetched all player positions',
      positions,
    );
  }

  @Get(':id')
  @ApiResponse(PlayerPositionDto, { type: 'read' })
  async findOne(@Param('id') id: string) {
    const position = await this.positionsService.findOne(id);
    return formatSuccessResponse(
      `Successfully fetched player position with the id of ${id}`,
      position,
    );
  }

  @Patch(':id')
  @ApiResponse(PlayerPositionDto, { type: 'update' })
  async update(
    @Param('id') id: string,
    @Body() updatePlayerPositionDto: UpdatePlayerPositionDto,
  ) {
    const position = await this.positionsService.update(
      id,
      updatePlayerPositionDto,
    );
    return formatSuccessResponse(
      `Successfully updated player position with the id of ${id}`,
      position,
    );
  }

  @Delete(':id')
  @ApiResponse(PlayerPositionDto, { type: 'delete' })
  async remove(@Param('id') id: string) {
    const position = await this.positionsService.remove(id);
    return formatSuccessResponse(
      `Successfully deleted player position with the id of ${id}`,
      position,
    );
  }
}
