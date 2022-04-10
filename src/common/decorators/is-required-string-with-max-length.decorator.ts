import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export function IsRequiredStringWithMaxLength(
  maxLength: number,
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    IsNotEmpty()(target, propertyKey);
    IsString()(target, propertyKey);
    Transform(({ value }) => value.trim())(target, propertyKey);
    MaxLength(maxLength)(target, propertyKey);
  };
}
