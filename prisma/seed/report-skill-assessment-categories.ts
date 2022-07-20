import { prisma } from './client';

const categoryNames = [
  'individual',
  'teamplay',
  'offense',
  'defense',
  'physical',
  'mental',
];

export async function generateReportSkillAssessmentCategories(
  authorId: number,
) {
  const promiseArr = categoryNames.map((name) =>
    prisma.reportSkillAssessmentCategory.create({
      data: {
        name,
        author: { connect: { id: authorId } },
      },
    }),
  );

  const [individual, teamplay, offense, defense, physical, mental] =
    await Promise.all(promiseArr);

  return { individual, teamplay, offense, defense, physical, mental };
}
