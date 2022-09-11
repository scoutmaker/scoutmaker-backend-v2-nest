import { prisma } from './client';

export async function generateRegions(countryId: string) {
  // Create Poland voivodeships
  const dolnoslaskiePromise = prisma.region.create({
    data: { name: 'Dolnośląskie', countryId },
  });
  const kujawskoPomorskiePromise = prisma.region.create({
    data: { name: 'Kujawsko-pomorskie', countryId },
  });
  const lubelskiePromise = prisma.region.create({
    data: { name: 'Lubelskie', countryId },
  });
  const lubuskiePromise = prisma.region.create({
    data: { name: 'Lubuskie', countryId },
  });
  const lodzkiePromise = prisma.region.create({
    data: { name: 'Łódzkie', countryId },
  });
  const opolskiePromise = prisma.region.create({
    data: { name: 'Opolskie', countryId },
  });
  const mazowieckiePromise = prisma.region.create({
    data: { name: 'Mazowieckie', countryId },
  });
  const malopolskiePromise = prisma.region.create({
    data: { name: 'Małopolskie', countryId },
  });
  const podkarpackiePromise = prisma.region.create({
    data: { name: 'Podkarpackie', countryId },
  });
  const podlaskiePromise = prisma.region.create({
    data: { name: 'Podlaskie', countryId },
  });
  const pomorskiePromise = prisma.region.create({
    data: { name: 'Pomorskie', countryId },
  });
  const slaskiePromise = prisma.region.create({
    data: { name: 'Śląskie', countryId },
  });
  const swietokrzyskiePromise = prisma.region.create({
    data: { name: 'Świętokrzyskie', countryId },
  });
  const warminskoMazurskiePromise = prisma.region.create({
    data: { name: 'Warmińsko-mazurskie', countryId },
  });
  const wielkopolskiePromise = prisma.region.create({
    data: { name: 'Wielkopolskie', countryId },
  });
  const zachodnioPomorskiePromise = prisma.region.create({
    data: { name: 'Zachodniopomorskie', countryId },
  });

  const [
    dolnoslaskie,
    kujawskoPomorskie,
    lubelskie,
    lubuskie,
    lodzkie,
    opolskie,
    mazowieckie,
    malopolskie,
    podkarpackie,
    podlaskie,
    pomorskie,
    slaskie,
    swietokrzyskie,
    warminskoMazurskie,
    wielkopolskie,
    zachodnioPomorskie,
  ] = await Promise.all([
    dolnoslaskiePromise,
    kujawskoPomorskiePromise,
    lubelskiePromise,
    lubuskiePromise,
    lodzkiePromise,
    opolskiePromise,
    mazowieckiePromise,
    malopolskiePromise,
    podkarpackiePromise,
    podlaskiePromise,
    pomorskiePromise,
    slaskiePromise,
    swietokrzyskiePromise,
    warminskoMazurskiePromise,
    wielkopolskiePromise,
    zachodnioPomorskiePromise,
  ]);

  return {
    dolnoslaskie,
    kujawskoPomorskie,
    lubuskie,
    lubelskie,
    lodzkie,
    opolskie,
    mazowieckie,
    malopolskie,
    podkarpackie,
    podlaskie,
    pomorskie,
    slaskie,
    swietokrzyskie,
    warminskoMazurskie,
    wielkopolskie,
    zachodnioPomorskie,
  };
}
