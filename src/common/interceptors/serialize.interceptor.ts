import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import {
  ClassConstructor,
  ClassTransformOptions,
  plainToInstance,
} from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class SerializeInterceptor implements NestInterceptor {
  constructor(
    private readonly dto: ClassConstructor<any>,
    private readonly target?: string,
  ) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data: any) => {
        const options: ClassTransformOptions = {
          excludeExtraneousValues: true,
        };

        const result = this.target
          ? {
              ...data,
              data: {
                ...data.data,
                [this.target]: plainToInstance(
                  this.dto,
                  data.data[this.target],
                  options,
                ),
              },
            }
          : {
              ...data,
              data: plainToInstance(this.dto, data.data, options),
            };
        return result;
      }),
    );
  }
}

export function Serialize(dto: ClassConstructor<any>, target?: string) {
  return UseInterceptors(new SerializeInterceptor(dto, target));
}
