import { prisma } from './client';

interface GenerateClubsArgs {
  polandId: number;
  adminId: number;
  wielkopolskieId: number;
  mazowieckieId: number;
  dolnoslaskieId: number;
  slaskieId: number;
}

export async function generateClubs({
  polandId,
  adminId,
  wielkopolskieId,
  mazowieckieId,
  dolnoslaskieId,
  slaskieId,
}: GenerateClubsArgs) {
  const lechPromise = prisma.club.create({
    data: {
      name: 'KKS Lech Poznań',
      slug: 'kks-lech-poznan',
      countryId: polandId,
      regionId: wielkopolskieId,
      authorId: adminId,
    },
  });

  const legiaPromise = prisma.club.create({
    data: {
      name: 'CWKS Legia Warszawa',
      slug: 'cwks-legia-warszawa',
      countryId: polandId,
      regionId: mazowieckieId,
      authorId: adminId,
    },
  });

  const lubinPromise = prisma.club.create({
    data: {
      name: 'KGHM Zagłębie Lubin',
      slug: 'kghm-zagłębie-lubin',
      countryId: polandId,
      regionId: dolnoslaskieId,
      authorId: adminId,
    },
  });

  const gornikPromise = prisma.club.create({
    data: {
      name: 'Górnik Zabrze Spółka Akcyjna',
      slug: 'gornik-zabrze-spolka-akcyjna',
      countryId: polandId,
      regionId: slaskieId,
      authorId: adminId,
    },
  });

  const [lech, legia, lubin, gornik] = await Promise.all([
    lechPromise,
    legiaPromise,
    lubinPromise,
    gornikPromise,
  ]);

  return { lech, legia, lubin, gornik };
}
