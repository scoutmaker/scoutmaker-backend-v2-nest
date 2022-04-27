import { UserRole } from '@prisma/client';
import { Chance } from 'chance';

import { PrismaService } from '../../src/modules/prisma/prisma.service';

const chance = new Chance();

interface ICreateTestUserArgs {
  prisma: PrismaService;
  args: {
    role: UserRole;
    regionId: string;
  };
}

export function createTestUser({ prisma, args }: ICreateTestUserArgs) {
  return prisma.user.create({
    data: {
      email: chance.email({ domain: 'example.com' }),
      firstName: chance.first(),
      lastName: chance.last(),
      password: 'Password123',
      region: { connect: { id: args.regionId } },
      role: args.role,
      status: 'ACTIVE',
    },
  });
}
