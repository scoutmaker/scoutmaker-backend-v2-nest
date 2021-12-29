import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CountriesModule } from './countries/countries.module';

@Module({
  imports: [PrismaModule, CountriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
