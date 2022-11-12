import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const MatchesAccessFilters = createParamDecorator(
  (data: never, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request['matchesAccessFilters'];
  },
);
