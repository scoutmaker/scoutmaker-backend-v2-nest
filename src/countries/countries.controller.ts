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
import { CountriesService } from './countries.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { ApiResponseDto } from '../utils/api-response/api-response.dto';
import { ApiResponse } from '../utils/api-response/api-response.decorator';
import { formatSuccessResponse } from '../utils/helpers';
import { AuthGuard } from '../guards/auth.guard';
import { PaginationOptions } from '../pagination/pagination-options.decorator';
import { FindAllCountriesDto } from './dto/find-all-countries.dto';
import { CountriesPaginationOptionDto } from './dto/countries-pagination-options.dto';
import { ApiPaginatedResponse } from '../utils/api-response/api-paginated-response.decorator';
import { CountryDto } from './dto/country.dto';
import { Serialize } from '../interceptors/serialize.interceptor';

type SingleCountryResponse = ApiResponseDto<CountryDto>;
type MultipleCountriesResponse = ApiResponseDto<CountryDto[]>;
@Controller('countries')
@ApiTags('countries')
@UseGuards(AuthGuard)
@ApiCookieAuth()
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Post()
  @ApiResponse(CountryDto, { type: 'create' })
  @Serialize(CountryDto)
  async create(
    @Body() createCountryDto: CreateCountryDto,
  ): Promise<SingleCountryResponse> {
    const country = await this.countriesService.create(createCountryDto);
    return formatSuccessResponse('Successfully created new country', country);
  }

  @Get()
  @ApiPaginatedResponse(CountryDto)
  @ApiQuery({ type: CountriesPaginationOptionDto })
  @Serialize(CountryDto, 'docs')
  async findAll(
    @PaginationOptions() paginationOptions: CountriesPaginationOptionDto,
    @Query() query: FindAllCountriesDto,
  ) {
    const data = await this.countriesService.findAll(paginationOptions, query);
    return formatSuccessResponse('Successfully fetched all countries', data);
  }

  @Get(':id')
  @ApiResponse(CountryDto, { type: 'read' })
  @Serialize(CountryDto)
  async findOne(@Param('id') id: string): Promise<SingleCountryResponse> {
    const country = await this.countriesService.findOne(id);
    return formatSuccessResponse(
      `Successfully fetched country with the id of ${id}`,
      country,
    );
  }

  @Patch(':id')
  @ApiResponse(CountryDto, { type: 'update' })
  @Serialize(CountryDto)
  async update(
    @Param('id') id: string,
    @Body() updateCountryDto: UpdateCountryDto,
  ): Promise<SingleCountryResponse> {
    const country = await this.countriesService.update(id, updateCountryDto);
    return formatSuccessResponse(
      `Successfully updated country with the id of ${id}`,
      country,
    );
  }

  @Delete(':id')
  @ApiResponse(CountryDto, { type: 'delete' })
  @Serialize(CountryDto)
  async remove(@Param('id') id: string): Promise<SingleCountryResponse> {
    const country = await this.countriesService.remove(id);
    return formatSuccessResponse(
      `Successfully removed country with the id of ${id}`,
      country,
    );
  }
}
