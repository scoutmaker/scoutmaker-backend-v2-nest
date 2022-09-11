import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { I18nLang, I18nService } from 'nestjs-i18n';

import { ApiPaginatedResponse } from '../../common/api-response/api-paginated-response.decorator';
import { ApiResponse } from '../../common/api-response/api-response.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { PaginationOptions } from '../../common/pagination/pagination-options.decorator';
import { formatSuccessResponse } from '../../utils/helpers';
import { CountriesService } from './countries.service';
import { CountriesPaginationOptionDto } from './dto/countries-pagination-options.dto';
import { CountryDto } from './dto/country.dto';
import { CreateCountryDto } from './dto/create-country.dto';
import { FindAllCountriesDto } from './dto/find-all-countries.dto';
import { UpdateCountryDto } from './dto/update-country.dto';

@Controller('countries')
@ApiTags('countries')
@UseGuards(AuthGuard)
@ApiCookieAuth()
export class CountriesController {
  constructor(
    private readonly countriesService: CountriesService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiResponse(CountryDto, { type: 'create' })
  @Serialize(CountryDto)
  async create(
    @I18nLang() lang: string,
    @Body() createCountryDto: CreateCountryDto,
  ) {
    const country = await this.countriesService.create(createCountryDto);
    const message = this.i18n.translate('countries.CREATE_MESSAGE', {
      lang,
      args: { name: country.name },
    });
    return formatSuccessResponse(message, country);
  }

  @Post('upload')
  @UseGuards(new RoleGuard(['ADMIN']))
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
    const { createdDocuments, errors } =
      await this.countriesService.createManyFromCsv(file);
    return formatSuccessResponse('Success!', { createdDocuments, errors });
  }

  @Get()
  @ApiPaginatedResponse(CountryDto)
  @ApiQuery({ type: CountriesPaginationOptionDto })
  @Serialize(CountryDto, 'docs')
  async findAll(
    @I18nLang() lang: string,
    @PaginationOptions() paginationOptions: CountriesPaginationOptionDto,
    @Query() query: FindAllCountriesDto,
  ) {
    const data = await this.countriesService.findAll(paginationOptions, query);
    const message = this.i18n.translate('countries.GET_ALL_MESSAGE', {
      lang,
      args: { currentPage: data.page, totalPages: data.totalPages },
    });
    return formatSuccessResponse(message, data);
  }

  @Get('list')
  @ApiResponse(CountryDto, { type: 'read' })
  @Serialize(CountryDto)
  async getList(@I18nLang() lang: string) {
    const countries = await this.countriesService.getList();
    const message = this.i18n.translate('countries.GET_LIST_MESSAGE', {
      lang,
    });
    return formatSuccessResponse(message, countries);
  }

  @Get(':id')
  @ApiResponse(CountryDto, { type: 'read' })
  @Serialize(CountryDto)
  async findOne(@I18nLang() lang: string, @Param('id') id: string) {
    const country = await this.countriesService.findOne(id);
    const message = this.i18n.translate('countries.GET_ONE_MESSAGE', {
      lang,
      args: { name: country.name },
    });
    return formatSuccessResponse(message, country);
  }

  @Patch(':id')
  @ApiResponse(CountryDto, { type: 'update' })
  @Serialize(CountryDto)
  async update(
    @I18nLang() lang: string,
    @Param('id') id: string,
    @Body() updateCountryDto: UpdateCountryDto,
  ) {
    const country = await this.countriesService.update(id, updateCountryDto);
    const message = this.i18n.translate('countries.UPDATE_MESSAGE', {
      lang,
      args: { name: country.name },
    });
    return formatSuccessResponse(message, country);
  }

  @Delete(':id')
  @ApiResponse(CountryDto, { type: 'delete' })
  @Serialize(CountryDto)
  async remove(@I18nLang() lang: string, @Param('id') id: string) {
    const country = await this.countriesService.remove(id);
    const message = this.i18n.translate('countries.DELETE_MESSAGE', {
      lang,
      args: { name: country.name },
    });
    return formatSuccessResponse(message, country);
  }
}
