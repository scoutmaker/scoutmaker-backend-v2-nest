import { IsString, Length, Matches } from 'class-validator';

type Args = { each?: boolean };

export function IsCuid(args?: Args): PropertyDecorator {
  const { each } = args || {};

  return function (target: any, propertyKey: string | symbol): void {
    IsString({ each })(target, propertyKey);
    Length(25, 25, {
      message: `${String(propertyKey)} must be a valid cuid${
        each ? ' array' : ''
      }`,
      each,
    })(target, propertyKey);
    Matches(/c*/, {
      message: `${String(propertyKey)} must be a valid cuid${
        each ? ' array' : ''
      }`,
      each,
    })(target, propertyKey);
  };
}
