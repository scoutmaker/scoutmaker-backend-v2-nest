import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { I18nLang, I18nService } from 'nestjs-i18n';

import { ApiResponse } from '../../common/api-response/api-response.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { formatSuccessResponse } from '../../utils/helpers';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { CurrentUserDto } from '../users/dto/current-user.dto';
import { DashboardService } from './dashboard.service';
import { DashboardDto } from './dto/dashboard.dto';

@Controller('dashboard')
@ApiTags('dashboard')
@UseGuards(AuthGuard)
@ApiSecurity('auth-token')
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly i18n: I18nService,
  ) {}

  @Get()
  @ApiResponse(DashboardDto, { type: 'read' })
  @Serialize(DashboardDto)
  async getData(@CurrentUser() user: CurrentUserDto, @I18nLang() lang: string) {
    const data = await this.dashboardService.getData(user);

    const message = this.i18n.translate('dashboard.GET_MESSAGE', {
      lang,
    });
    return formatSuccessResponse(message, data);
  }
}
