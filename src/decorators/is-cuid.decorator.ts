import { IsString, Length, Matches } from 'class-validator';

export function IsCuid(): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    IsString()(target, propertyKey);
    Length(25, 25, { message: `${String(propertyKey)} must be a valid cuid` })(
      target,
      propertyKey,
    );
    Matches(/c*/, { message: `${String(propertyKey)} must be a valid cuid` })(
      target,
      propertyKey,
    );
  };
}
