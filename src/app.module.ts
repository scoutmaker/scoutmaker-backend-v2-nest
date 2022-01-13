import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import { CountriesModule } from './modules/countries/countries.module';
import { RegionsModule } from './modules/regions/regions.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ClubsModule } from './modules/clubs/clubs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    PrismaModule,
    CountriesModule,
    RegionsModule,
    UsersModule,
    AuthModule,
    ClubsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
