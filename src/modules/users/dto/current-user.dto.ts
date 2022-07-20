import { UserRole } from '@prisma/client';

export type CurrentUserDto = {
  id: number;
  role: UserRole;
  organizationId: number;
};
