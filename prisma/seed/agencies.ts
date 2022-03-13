import { prisma } from './client';

export async function generateAgencies(authorId: string, polandId: string) {
  const fabrykaFutboluPromise = prisma.agency.create({
    data: {
      name: 'Fabryka Futbolu',
      authorId,
      countryId: polandId,
      transfermarktUrl:
        'https://www.transfermarkt.com/fabryka-futbolu/beraterfirma/berater/969',
    },
  });

  const football11playersPromise = prisma.agency.create({
    data: {
      name: '11 Football Players',
      authorId,
      countryId: polandId,
      transfermarktUrl:
        'https://www.transfermarkt.com/11-football-players/beraterfirma/berater/5441',
    },
  });

  const [fabrykaFutbolu, football11players] = await Promise.all([
    fabrykaFutboluPromise,
    football11playersPromise,
  ]);

  return { fabrykaFutbolu, football11players };
}
