import * as bcrypt from 'bcrypt';
import { Chance } from 'chance';

import { prisma } from './client';

const chance = new Chance();

const arrayOfFour = Array.from({ length: 4 }, (_, i) => i + 1);

export async function generateUsers(regionId: number) {
  const hashedPassword = await bcrypt.hash('Password123', 10);

  const adminPromise = prisma.user.create({
    data: {
      email: 'admin@example.com',
      firstName: 'John',
      lastName: 'Admin',
      password: hashedPassword,
      regionId: regionId,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  const regularScoutsPromises = arrayOfFour.map((_) =>
    prisma.user.create({
      data: {
        email: chance.email({ domain: 'example.com' }),
        firstName: chance.first(),
        lastName: chance.last(),
        password: hashedPassword,
        regionId,
        role: 'SCOUT',
        status: 'ACTIVE',
      },
    }),
  );

  const playmakerScoutPromises = arrayOfFour.map((_) =>
    prisma.user.create({
      data: {
        email: chance.email({ domain: 'example.com' }),
        firstName: chance.first(),
        lastName: chance.last(),
        password: hashedPassword,
        regionId,
        role: 'PLAYMAKER_SCOUT',
        status: 'ACTIVE',
      },
    }),
  );

  const [
    admin,
    scout1,
    scout2,
    scout3,
    scout4,
    playmakerScout1,
    playmakerScout2,
    playmakerScout3,
    playmakerScout4,
  ] = await Promise.all([
    adminPromise,
    ...regularScoutsPromises,
    ...playmakerScoutPromises,
  ]);

  return {
    admin,
    scout1,
    scout2,
    scout3,
    scout4,
    playmakerScout1,
    playmakerScout2,
    playmakerScout3,
    playmakerScout4,
  };
}
