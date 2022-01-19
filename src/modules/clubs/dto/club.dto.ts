import {
  Expose,
  plainToClass,
  plainToInstance,
  Transform,
} from 'class-transformer';
import { CompetitionsOnClubDto } from './competitions-on-club.dto';
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

  @Expose()
  @Transform(({ value }) =>
    plainToInstance(CompetitionsOnClubDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  competitions: CompetitionsOnClubDto[];
}
