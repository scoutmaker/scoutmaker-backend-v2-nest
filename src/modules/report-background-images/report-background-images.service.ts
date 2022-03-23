import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateReportBackgroundImageDto } from './dto/create-report-background-image.dto';
import { UpdateReportBackgroundImageDto } from './dto/update-report-background-image.dto';

@Injectable()
export class ReportBackgroundImagesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createReportBackgroundImageDto: CreateReportBackgroundImageDto) {
    return this.prisma.reportBackgroundImage.create({
      data: createReportBackgroundImageDto,
    });
  }

  findAll() {
    return this.prisma.reportBackgroundImage.findMany();
  }

  findOne(id: string) {
    return this.prisma.reportBackgroundImage.findUnique({ where: { id } });
  }

  update(
    id: string,
    updateReportBackgroundImageDto: UpdateReportBackgroundImageDto,
  ) {
    return this.prisma.reportBackgroundImage.update({
      where: { id },
      data: updateReportBackgroundImageDto,
    });
  }

  remove(id: string) {
    return this.prisma.reportBackgroundImage.delete({ where: { id } });
  }
}
