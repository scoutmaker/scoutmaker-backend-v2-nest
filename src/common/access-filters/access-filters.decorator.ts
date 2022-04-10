import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AccessFilters = createParamDecorator(
  (data: never, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.accessFilters;
  },
);
