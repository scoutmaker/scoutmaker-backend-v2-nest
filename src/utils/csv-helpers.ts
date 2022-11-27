import { BadRequestException } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { parse } from 'papaparse';

export function parseCsv<CSVInput>(buffer: string) {
  return parse<CSVInput>(buffer, { header: true, dynamicTyping: true });
}

export async function validateInstances(instances: any[]) {
  const totalValidationErrors: ValidationError[] = [];

  for (const instance of instances) {
    const errors = await validate(instance);
    if (errors.length > 0) {
      totalValidationErrors.push(...errors);
    }
  }

  if (totalValidationErrors.length !== 0) {
    throw new BadRequestException(totalValidationErrors, 'Bad CSV content');
  }
}
