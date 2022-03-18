import { User } from '@prisma/client';

export function getUserNamesString(users: User[]) {
  return users.map((user) => `${user.firstName} ${user.lastName}`).join(', ');
}
