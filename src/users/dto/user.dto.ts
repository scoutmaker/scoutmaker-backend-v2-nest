import { AccountStatus, UserRole } from '@prisma/client';
import { Expose } from 'class-transformer';
import { RegionEntity } from 'src/regions/entities/region.entity';

export class UserDto {
  @Expose()
  id: string;

  @Expose()
  role: UserRole;

  @Expose()
  status: AccountStatus;

  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  phone?: string;

  @Expose()
  city?: string;

  @Expose()
  activeRadius: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  region: RegionEntity;
}
