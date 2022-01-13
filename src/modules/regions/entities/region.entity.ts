import { Region } from '@prisma/client';
import { CountryEntity } from '../../countries/entities/country.entity';

export class RegionEntity implements Region {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  countryId: string;
  country?: CountryEntity;
}
