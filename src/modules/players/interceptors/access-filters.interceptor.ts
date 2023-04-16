import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AccessFiltersInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();

    const { user } = request;

    if (user.role === 'ADMIN') {
      request.accessFilters = null;
      return next.handle();
    }

    const accessFilters: Prisma.PlayerWhereInput = {
      OR: [
        // Users can access players they created
        {
          authorId: request.user.id,
        },
        // Users can access any players created by ADMIN, PLAYMAKER-SCOUT or PLAYMAKER-SCOUTING-MANAGER users
        { createdByRole: { not: 'SCOUT' } },
        {
          createdByRole: null,
          author: { role: { not: 'SCOUT' } },
        },
        // Users can access players with the public flag set to true
        { isPublic: true },
      ],
    };

    request.accessFilters = accessFilters;

    return next.handle();
  }
}
