import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';

const include: Prisma.RegionInclude = { country: true };

@Injectable()
export class RegionsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createRegionDto: CreateRegionDto) {
    return this.prisma.region.create({
      data: createRegionDto,
      include,
    });
  }

  findAll() {
    return this.prisma.region.findMany({ include });
  }

  findOne(id: string) {
    return this.prisma.region.findUnique({ where: { id }, include });
  }

  update(id: string, updateRegionDto: UpdateRegionDto) {
    return this.prisma.region.update({
      where: { id },
      data: updateRegionDto,
      include,
    });
  }

  remove(id: string) {
    return this.prisma.region.delete({ where: { id } });
  }
}
