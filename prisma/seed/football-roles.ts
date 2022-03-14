import { prisma } from './client';

const roles = [
  'Dyrektor Sportowy',
  'Dyrektor Skautingu',
  'Skaut',
  'Prezes',
  'Vice Prezes',
  'Członek Zarządu',
  'Analityk',
  'Trener',
  'II Trener',
  'Sztab Szkoleniowy',
  'Agent Sportowy',
];

export async function generateFootballRoles() {
  return prisma.userFootballRole.createMany({
    data: roles.map((name) => ({ name })),
  });
}
