import { prisma } from './client';

export async function generatePositions() {
  const gkPromise = prisma.playerPosition.create({
    data: { name: 'bramkarz', code: 'GK' },
  });

  const lbPromise = prisma.playerPosition.create({
    data: { name: 'lewy obrońca', code: 'LB' },
  });

  const rbPromise = prisma.playerPosition.create({
    data: { name: 'prawy obrońca', code: 'RB' },
  });

  const cbPromise = prisma.playerPosition.create({
    data: { name: 'środkowy obrońca', code: 'CB' },
  });

  const lwPromise = prisma.playerPosition.create({
    data: { name: 'lewy wahadłowy', code: 'LW' },
  });

  const cmPromise = prisma.playerPosition.create({
    data: { name: 'środkowy pomocnik', code: 'CM' },
  });

  const lmPromise = prisma.playerPosition.create({
    data: { name: 'lewy pomocnik', code: 'LM' },
  });

  const fPromise = prisma.playerPosition.create({
    data: { name: 'napastnik', code: 'F' },
  });

  const [gk, lb, rb, cb, lw, cm, lm, f] = await Promise.all([
    gkPromise,
    lbPromise,
    rbPromise,
    cbPromise,
    lwPromise,
    cmPromise,
    lmPromise,
    fPromise,
  ]);

  return { gk, lb, rb, cb, lw, cm, lm, f };
}
