import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { I18nLang, I18nService } from 'nestjs-i18n';

import { ApiPaginatedResponse } from '../../common/api-response/api-paginated-response.decorator';
import { ApiResponse } from '../../common/api-response/api-response.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
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
    const message = await this.i18n.translate('countries.CREATE_MESSAGE', {
      lang,
      args: { name: country.name },
    });
    return formatSuccessResponse(message, country);
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
    const message = await this.i18n.translate('countries.GET_ALL_MESSAGE', {
      lang,
      args: { currentPage: data.page, totalPages: data.totalPages },
    });
    return formatSuccessResponse(message, data);
  }

  @Get(':id')
  @ApiResponse(CountryDto, { type: 'read' })
  @Serialize(CountryDto)
  async findOne(@I18nLang() lang: string, @Param('id') id: string) {
    const country = await this.countriesService.findOne(id);
    const message = await this.i18n.translate('countries.GET_ONE_MESSAGE', {
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
    const message = await this.i18n.translate('countries.UPDATE_MESSAGE', {
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
    const message = await this.i18n.translate('countries.DELETE_MESSAGE', {
      lang,
      args: { name: country.name },
    });
    return formatSuccessResponse(message, country);
  }
}
