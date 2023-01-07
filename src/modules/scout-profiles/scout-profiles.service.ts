import { Injectable } from '@nestjs/common';
import { Prisma, ScoutProfile } from '@prisma/client';

import { parseCsv, validateInstances } from '../../utils/csv-helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScoutProfileDto } from './dto/create-scout-profile.dto';
import { UpdateScoutProfileDto } from './dto/update-scout-profile.dto';

const include: Prisma.ScoutProfileInclude = {
  user: true,
};

interface CsvInput {
  userId: number | string;
  cooperationStartDate?: string;
  description?: string;
  rating?: number;
}

@Injectable()
export class ScoutProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createScoutProfileDto: CreateScoutProfileDto) {
    return this.prisma.scoutProfile.create({
      data: createScoutProfileDto,
      include,
    });
  }

  async createManyFromCsv(file: Express.Multer.File) {
    const result = parseCsv<CsvInput>(file.buffer.toString());

    const instances = result.data.map(
      ({ userId, cooperationStartDate, description, rating }) => {
        const instance = new CreateScoutProfileDto();

        instance.userId =
          typeof userId === 'number' ? userId.toString() : userId;
        instance.cooperationStartDate = cooperationStartDate;
        instance.description = description;
        instance.rating = rating;

        return instance;
      },
    );

    await validateInstances(instances);

    const createdDocuments: ScoutProfile[] = [];
    const errors: any[] = [];

    for (const [index, instance] of instances.entries()) {
      try {
        const created = await this.create(instance);
        createdDocuments.push(created);
      } catch (error) {
        errors.push({ index, name: instance.userId, error });
      }
    }

    return {
      csvRowsCount: result.data.length,
      createdCount: createdDocuments.length,
      errors,
    };
  }

  update(id: string, updateScoutProfileDto: UpdateScoutProfileDto) {
    return this.prisma.scoutProfile.update({
      where: { id },
      data: updateScoutProfileDto,
      include,
    });
  }

  remove(id: string) {
    return this.prisma.scoutProfile.delete({ where: { id }, include });
  }
}
