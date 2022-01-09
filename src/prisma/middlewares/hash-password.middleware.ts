import type { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export async function hashPasswordMiddleware(
  params: Prisma.MiddlewareParams,
  next: (params: Prisma.MiddlewareParams) => Promise<any>,
) {
  const condition =
    (params.action === 'create' || params.action === 'update') &&
    params.args.data.password &&
    params.model === 'User';
  if (condition) {
    const user = params.args.data;
    user.password = await bcrypt.hash(user.password, 10);
  }
  return next(params);
}
