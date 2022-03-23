import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReportBackgroundImagesService } from './report-background-images.service';
import { CreateReportBackgroundImageDto } from './dto/create-report-background-image.dto';
import { UpdateReportBackgroundImageDto } from './dto/update-report-background-image.dto';

@Controller('report-background-images')
export class ReportBackgroundImagesController {
  constructor(private readonly reportBackgroundImagesService: ReportBackgroundImagesService) {}

  @Post()
  create(@Body() createReportBackgroundImageDto: CreateReportBackgroundImageDto) {
    return this.reportBackgroundImagesService.create(createReportBackgroundImageDto);
  }

  @Get()
  findAll() {
    return this.reportBackgroundImagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportBackgroundImagesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReportBackgroundImageDto: UpdateReportBackgroundImageDto) {
    return this.reportBackgroundImagesService.update(+id, updateReportBackgroundImageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportBackgroundImagesService.remove(+id);
  }
}
