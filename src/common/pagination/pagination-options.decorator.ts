import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const PaginationOptions = createParamDecorator(
  (data: never, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.paginationOptions;
  },
);
