import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';
export const OptionalStringArray = () =>
  applyDecorators(
    IsOptional(),
    Transform(({ value }) => (typeof value === 'string' ? [value] : value)),
    IsArray(),
    IsString({ each: true }),
  );
