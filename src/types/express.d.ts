import { CurrentUserDto } from '../modules/users/dto/current-user.dto';
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: CurrentUserDto;
      paginationOptions?: any;
      accessFilters?: any;
    }
  }
}
