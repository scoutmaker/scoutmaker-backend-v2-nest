import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { I18nLang, I18nService } from 'nestjs-i18n';

import { ApiResponse } from '../../common/api-response/api-response.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { formatSuccessResponse } from '../../utils/helpers';
import { CreateScoutProfileDto } from './dto/create-scout-profile.dto';
import { ScoutProfileDto } from './dto/scout-profile.dto';
import { UpdateScoutProfileDto } from './dto/update-scout-profile.dto';
import { ScoutProfilesService } from './scout-profiles.service';

@Controller('scout-profiles')
@ApiTags('scout profiles')
@UseGuards(AuthGuard, new RoleGuard(['ADMIN']))
@ApiSecurity('auth-token')
export class ScoutProfilesController {
  constructor(
    private readonly profilesService: ScoutProfilesService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(ScoutProfileDto, { type: 'create' })
  @Serialize(ScoutProfileDto)
  async create(
    @I18nLang() lang: string,
    @Body() createScoutProfileDto: CreateScoutProfileDto,
  ) {
    const profile = await this.profilesService.create(createScoutProfileDto);
    const message = this.i18n.translate('scout-profiles.CREATE_MESSAGE', {
      lang,
      args: { id: profile.id },
    });
    return formatSuccessResponse(message, profile);
  }

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const { createdCount, csvRowsCount, errors } =
      await this.profilesService.createManyFromCsv(file);
    return formatSuccessResponse('Success!', {
      csvRowsCount,
      createdCount,
      errors,
    });
  }

  @Patch(':id')
  @ApiResponse(ScoutProfileDto, { type: 'update' })
  @Serialize(ScoutProfileDto)
  async update(
    @I18nLang() lang: string,
    @Param('id') id: string,
    @Body() updateScoutProfileDto: UpdateScoutProfileDto,
  ) {
    const profile = await this.profilesService.update(
      id,
      updateScoutProfileDto,
    );
    const message = this.i18n.translate('scout-profiles.UPDATE_MESSAGE', {
      lang,
      args: { id: profile.id },
    });
    return formatSuccessResponse(message, profile);
  }

  @Get(':id')
  @ApiResponse(ScoutProfileDto, { type: 'read' })
  @Serialize(ScoutProfileDto)
  async findOne(@I18nLang() lang: string, @Param('id') id: string) {
    const profile = await this.profilesService.findOne(id);
    const message = this.i18n.translate('scout-profiles.GET_ONE_MESSAGE', {
      lang,
      args: { id: profile.id },
    });
    return formatSuccessResponse(message, profile);
  }

  @Delete(':id')
  @ApiResponse(ScoutProfileDto, { type: 'delete' })
  @Serialize(ScoutProfileDto)
  async remove(@I18nLang() lang: string, @Param('id') id: string) {
    const profile = await this.profilesService.remove(id);
    const message = this.i18n.translate('scout-profiles.DELETE_MESSAGE', {
      lang,
      args: { id: profile.id },
    });
    return formatSuccessResponse(message, profile);
  }
}
