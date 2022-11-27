import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

type ExceptionMeta = { cause?: string };

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    console.log({ exception: JSON.stringify(exception, null, 2) });

    const message =
      (exception?.meta as ExceptionMeta)?.cause ||
      exception.message.replace(/\n/g, '');
    let status: number;

    console.log(message);

    switch (exception.code) {
      case 'P2002':
        status = HttpStatus.CONFLICT;
        response.status(status).json({
          statusCode: status,
          message: `Unique constraint failed on field "${exception?.meta?.target}"`,
        });
        break;

      case 'P2003':
        status = HttpStatus.BAD_REQUEST;
        response.status(status).json({
          statusCode: status,
          message,
        });
        break;

      case 'P2025':
        status = HttpStatus.NOT_FOUND;
        response.status(status).json({
          statusCode: status,
          message,
        });
        break;

      default:
        // default 500 error code
        super.catch(exception, host);
        break;
    }
  }
}
