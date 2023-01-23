import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiResponse } from '../../common/api-response/api-response.decorator';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { LandingPageNumbersDto } from './dto/landing.dto';
import { LandingService } from './landing.service';

@Controller('landing')
@ApiTags('landing-page')
export class LandingController {
  constructor(private readonly landingService: LandingService) {}

  @Get()
  @ApiResponse(LandingPageNumbersDto, { type: 'read' })
  @Serialize(LandingPageNumbersDto)
  getData() {
    return this.landingService.getAppNumbers();
  }
}
