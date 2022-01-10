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
import { ApiCookieAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PaginationOptions } from 'src/pagination/pagination-options.decorator';
import { PaginationOptionsDto } from 'src/pagination/pagination-options.dto';
import { ApiResponse } from 'src/utils/api-response/api-response.decorator';
import { formatSuccessResponse } from 'src/utils/helpers';
import { AuthGuard } from '../guards/auth.guard';
import { ClubsService } from './clubs.service';
import { ClubDto } from './dto/club.dto';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';

@Controller('clubs')
@ApiTags('clubs')
@UseGuards(AuthGuard)
@ApiCookieAuth()
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  @Post()
  @ApiResponse(ClubDto, { type: 'read' })
  async create(@Body() createClubDto: CreateClubDto) {
    const club = await this.clubsService.create(createClubDto);
    return formatSuccessResponse('Successfully created new club', club);
  }

  @Get()
  @ApiResponse(ClubDto, { isArray: true, type: 'read' })
  @ApiQuery({ type: PaginationOptionsDto })
  async findAll(
    @PaginationOptions() paginationOptions: PaginationOptionsDto,
    @Query() query: any,
  ) {
    const data = await this.clubsService.findAll(paginationOptions, query);
    return formatSuccessResponse('Successfully fetched all clubs', data);
  }

  @Get(':id')
  @ApiResponse(ClubDto, { type: 'read' })
  async findOne(@Param('id') id: string) {
    const club = await this.clubsService.findOne(id);
    return formatSuccessResponse(
      `Successfully fetched club with the id of ${id}`,
      club,
    );
  }

  @Patch(':id')
  @ApiResponse(ClubDto, { type: 'update' })
  async update(@Param('id') id: string, @Body() updateClubDto: UpdateClubDto) {
    const club = await this.clubsService.update(id, updateClubDto);
    return formatSuccessResponse(
      `Successfully updated club with the id of ${id}`,
      club,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const club = await this.clubsService.remove(id);
    return formatSuccessResponse(
      `Successfully removed club with the id of ${id}`,
      club,
    );
  }
}
