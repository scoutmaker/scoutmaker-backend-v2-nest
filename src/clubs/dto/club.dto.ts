import { Expose } from 'class-transformer';
import { RegionEntity } from '../../regions/entities/region.entity';

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

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  region: RegionEntity;
}
