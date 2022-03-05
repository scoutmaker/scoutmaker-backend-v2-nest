import * as bcrypt from 'bcrypt';

import { prisma } from './client';

export async function generateUser(regionId: string) {
  const hashedPassword = await bcrypt.hash('Password123', 10);

  const admin = await prisma.user.create({
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

  return admin;
}
