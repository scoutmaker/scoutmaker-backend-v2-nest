import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class SerializeInterceptor implements NestInterceptor {
  constructor(private readonly dto: ClassConstructor<any>) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    console.log("I'm running before the handler", request.body);

    return next.handle().pipe(
      map((data: any) => {
        console.log("I'm running before the response is sent out", data);

        return {
          ...data,
          data: plainToInstance(this.dto, data.data, {
            excludeExtraneousValues: true,
          }),
        };
      }),
    );
  }
}

export function Serialize(dto: ClassConstructor<any>) {
  return UseInterceptors(new SerializeInterceptor(dto));
}
