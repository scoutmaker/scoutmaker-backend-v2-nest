import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Request } from 'express';
import { Observable } from 'rxjs';

type RoleGuardRoles = Array<UserRole | 'SCOUT_ORGANIZATION'>;

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly roles: RoleGuardRoles) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const { role, organizationId } = request?.user;

    if (
      this.roles.includes('SCOUT_ORGANIZATION') &&
      role === 'SCOUT' &&
      organizationId
    ) {
      return true;
    }

    if (!this.roles.includes(role)) {
      throw new ForbiddenException(
        `User role ${role} is not authorized to access route ${request.route?.path}`,
      );
    }

    return true;
  }
}
