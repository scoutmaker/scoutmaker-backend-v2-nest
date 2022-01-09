import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
      };
    }
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const { token } = request.cookies || {};

    if (!token) {
      return false;
    }

    const decoded = jwt.verify(token, this.configService.get('JWT_SECRET'));
    request.user = decoded;
    return true;
  }
}
