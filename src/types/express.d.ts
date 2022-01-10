import { UserRole } from '@prisma/client';
import { TPaginationOptions } from './pagination';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
      };
      paginationOptions?: TPaginationOptions;
    }
  }
}
