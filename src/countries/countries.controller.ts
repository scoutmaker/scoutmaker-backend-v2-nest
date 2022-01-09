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
import { CountriesService } from './countries.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { CountryEntity } from './entities/country.entity';
import { ApiResponseDto } from '../utils/api-response/api-response.dto';
import { ApiResponse } from '../utils/api-response/api-response.decorator';
import { formatSuccessResponse } from '../utils/helpers';
import { AuthGuard } from '../guards/auth.guard';

type SingleCountryResponse = ApiResponseDto<CountryEntity>;
type MultipleCountriesResponse = ApiResponseDto<CountryEntity[]>;
@Controller('countries')
@ApiTags('countries')
@UseGuards(AuthGuard)
@ApiCookieAuth()
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Post()
  @ApiResponse(CountryEntity, { type: 'create' })
  async create(
    @Body() createCountryDto: CreateCountryDto,
  ): Promise<SingleCountryResponse> {
    const country = await this.countriesService.create(createCountryDto);
    return formatSuccessResponse('Successfully created new country', country);
  }

  @Get()
  @ApiResponse(CountryEntity, { isArray: true, type: 'read' })
  async findAll(): Promise<MultipleCountriesResponse> {
    const countries = await this.countriesService.findAll();
    return formatSuccessResponse(
      'Successfully fetched all countries',
      countries,
    );
  }

  @Get(':id')
  @ApiResponse(CountryEntity, { type: 'read' })
  async findOne(@Param('id') id: string): Promise<SingleCountryResponse> {
    const country = await this.countriesService.findOne(id);
    return formatSuccessResponse(
      `Successfully fetched country with the id of ${id}`,
      country,
    );
  }

  @Patch(':id')
  @ApiResponse(CountryEntity, { type: 'update' })
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
  @ApiResponse(CountryEntity, { type: 'delete' })
  async remove(@Param('id') id: string): Promise<SingleCountryResponse> {
    const country = await this.countriesService.remove(id);
    return formatSuccessResponse(
      `Successfully removed country with the id of ${id}`,
      country,
    );
  }
}
