import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { JwtExceptionFilter } from './common/filters/jwt-exception.filter';
import { PrismaClientExceptionFilter } from './common/filters/prisma-client-exception.filter';

const port = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // Set global prefix for all routes
  app.setGlobalPrefix('api/v2');

  // Cookie parser
  app.use(cookieParser());

  // Validation pipeline
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      validateCustomDecorators: true,
      enableDebugMessages: true,
    }),
  );

  // apply PrismaClientExceptionFilter to entire application, requires HttpAdapterHost because it extends BaseExceptionFilter
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
  app.useGlobalFilters(new JwtExceptionFilter(httpAdapter));

  // Swagger Open API Docs
  const config = new DocumentBuilder()
    .setTitle('Scoutmaker Pro API v2')
    .setVersion('2.0')
    .addCookieAuth('token')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(port);
}

bootstrap();
