import { UserRole } from '@prisma/client';

export const PASSWORD_REGEXP = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/;

// Default pagination options
export const DEFAULT_SORT = 'id';
export const DEFAULT_LIMIT = 20;
export const DEFAULT_PAGE = 1;
export const DEFAULT_ORDER = 'desc';

export const REDIS_TTL = 60 * 60 * 24;

export const privilegedRoles: UserRole[] = [
  'ADMIN',
  'PLAYMAKER_SCOUT',
  'PLAYMAKER_SCOUT_MANAGER',
];

export const playmakerRoles: UserRole[] = [
  'PLAYMAKER_SCOUT',
  'PLAYMAKER_SCOUT_MANAGER',
];
