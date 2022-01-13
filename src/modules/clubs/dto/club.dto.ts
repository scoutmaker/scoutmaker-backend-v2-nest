import { Expose, plainToClass, Transform } from 'class-transformer';
import { RegionDto } from '../../regions/dto/region.dto';

export class ClubDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  lnpId?: string;

  @Expose()
  city?: string;

  @Expose()
  postalCode?: string;

  @Expose()
  street?: string;

  @Expose()
  website?: string;

  @Expose()
  twitter?: string;

  @Expose()
  facebook?: string;

  @Expose()
  instagram?: string;

  @Transform(({ value }) =>
    plainToClass(RegionDto, value, { excludeExtraneousValues: true }),
  )
  @Expose()
  region: RegionDto;
}