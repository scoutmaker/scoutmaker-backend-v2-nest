import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportBackgroundImageDto } from './dto/create-report-background-image.dto';
import { FindAllReportBackgroundImagesDto } from './dto/find-all-report-background-images.dto';
import { ReportBackgroundImagesPaginationOptionsDto } from './dto/report-background-images-pagination-options.dto';
import { UpdateReportBackgroundImageDto } from './dto/update-report-background-image.dto';

@Injectable()
export class ReportBackgroundImagesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createReportBackgroundImageDto: CreateReportBackgroundImageDto) {
    return this.prisma.reportBackgroundImage.create({
      data: createReportBackgroundImageDto,
    });
  }

  async findAll(
    {
      limit,
      page,
      sortBy,
      sortingOrder,
    }: ReportBackgroundImagesPaginationOptionsDto,
    { name }: FindAllReportBackgroundImagesDto,
  ) {
    const where: Prisma.ReportBackgroundImageWhereInput = {
      name: { contains: name, mode: 'insensitive' },
    };

    const reportBackgroundImages =
      await this.prisma.reportBackgroundImage.findMany({
        where,
        take: limit,
        skip: calculateSkip(page, limit),
        orderBy: { [sortBy]: sortingOrder },
      });

    const total = await this.prisma.reportBackgroundImage.count({ where });

    return formatPaginatedResponse({
      docs: reportBackgroundImages,
      totalDocs: total,
      limit,
      page,
    });
  }

  getList() {
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
