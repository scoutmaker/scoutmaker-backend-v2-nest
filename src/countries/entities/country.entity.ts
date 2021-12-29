import { Country } from '@prisma/client';

export class CountryEntity implements Country {
  id: string;
  name: string;
  code: string;
  isEuMember: boolean;
  createdAt: Date;
  updatedAt: Date;
}
