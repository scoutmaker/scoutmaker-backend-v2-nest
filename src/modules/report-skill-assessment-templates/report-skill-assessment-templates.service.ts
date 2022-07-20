import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreateReportSkillAssessmentTemplateDto } from './dto/create-report-skill-assessment-template.dto';
import { UpdateReportSkillAssessmentTemplateDto } from './dto/update-report-skill-assessment-template.dto';

const include: Prisma.ReportSkillAssessmentTemplateInclude = {
  category: true,
};

@Injectable()
export class ReportSkillAssessmentTemplatesService {
  constructor(private readonly prisma: PrismaService) {}

  create(
    createReportSkillAssessmentTemplateDto: CreateReportSkillAssessmentTemplateDto,
    authorId: string,
  ) {
    const { categoryId, ...rest } = createReportSkillAssessmentTemplateDto;

    return this.prisma.reportSkillAssessmentTemplate.create({
      data: {
        ...rest,
        category: { connect: { id: categoryId } },
        author: { connect: { id: authorId } },
      },
      include,
    });
  }

  findAll() {
    return this.prisma.reportSkillAssessmentTemplate.findMany({ include });
  }

  findOne(id: number) {
    return this.prisma.reportSkillAssessmentTemplate.findUnique({
      where: { id },
      include,
    });
  }

  update(
    id: number,
    updateReportSkillAssessmentTemplateDto: UpdateReportSkillAssessmentTemplateDto,
  ) {
    return this.prisma.reportSkillAssessmentTemplate.update({
      where: { id },
      data: updateReportSkillAssessmentTemplateDto,
      include,
    });
  }

  remove(id: number) {
    return this.prisma.reportSkillAssessmentTemplate.delete({
      where: { id },
      include,
    });
  }
}
