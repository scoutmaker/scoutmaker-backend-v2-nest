import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';

@Catch(JsonWebTokenError)
export class JwtExceptionFilter extends BaseExceptionFilter {
  catch(exception: JsonWebTokenError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(HttpStatus.UNAUTHORIZED).json({
      statusCode: HttpStatus.UNAUTHORIZED,
      message: exception.message,
    });
  }
}
