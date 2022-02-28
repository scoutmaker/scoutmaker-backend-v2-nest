import { prisma } from './client';

interface GenerateClubsArgs {
  polandId: string;
  adminId: string;
  wielkopolskieId: string;
  mazowieckieId: string;
  dolnoslaskieId: string;
  slaskieId: string;
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
      countryId: polandId,
      regionId: wielkopolskieId,
      authorId: adminId,
    },
  });

  const legiaPromise = prisma.club.create({
    data: {
      name: 'CWKS Legia Warszawa',
      countryId: polandId,
      regionId: mazowieckieId,
      authorId: adminId,
    },
  });

  const lubinPromise = prisma.club.create({
    data: {
      name: 'KGHM Zagłębie Lubin',
      countryId: polandId,
      regionId: dolnoslaskieId,
      authorId: adminId,
    },
  });

  const gornikPromise = prisma.club.create({
    data: {
      name: 'Górnik Zabrze Spółka Akcyjna',
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
