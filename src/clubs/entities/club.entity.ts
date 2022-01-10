import { Club } from '@prisma/client';

export class ClubEntity implements Club {
  id: string;
  name: string;
  lnpID: string;
  city: string;
  postalCode: string;
  street: string;
  website: string;
  twitter: string;
  facebook: string;
  instagram: string;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  authorId: string;
  regionId: string;
}
