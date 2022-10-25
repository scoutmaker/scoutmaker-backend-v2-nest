import { Prisma } from '@prisma/client';

export const deleteIfExists = async (fn: () => Promise<any>) => {
  try {
    await fn();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.meta?.cause !== 'Record to delete does not exist.') throw error;
    }
  }
};
