import { UserRole } from '@prisma/client';

export type CurrentUserDto = {
  id: string;
  role: UserRole;
  organizationId: string;
};
