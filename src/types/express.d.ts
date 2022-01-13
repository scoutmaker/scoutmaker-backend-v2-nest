import { CurrentUserDto } from '../users/dto/current-user.dto';
import { TPaginationOptions } from './pagination';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: CurrentUserDto;
      paginationOptions?: TPaginationOptions;
    }
  }
}
