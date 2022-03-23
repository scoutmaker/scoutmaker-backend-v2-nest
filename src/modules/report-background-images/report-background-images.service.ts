import { Injectable } from '@nestjs/common';
import { CreateReportBackgroundImageDto } from './dto/create-report-background-image.dto';
import { UpdateReportBackgroundImageDto } from './dto/update-report-background-image.dto';

@Injectable()
export class ReportBackgroundImagesService {
  create(createReportBackgroundImageDto: CreateReportBackgroundImageDto) {
    return 'This action adds a new reportBackgroundImage';
  }

  findAll() {
    return `This action returns all reportBackgroundImages`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reportBackgroundImage`;
  }

  update(id: number, updateReportBackgroundImageDto: UpdateReportBackgroundImageDto) {
    return `This action updates a #${id} reportBackgroundImage`;
  }

  remove(id: number) {
    return `This action removes a #${id} reportBackgroundImage`;
  }
}
