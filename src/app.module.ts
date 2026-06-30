import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ArcjetModule, ArcjetGuard, shield, fixedWindow } from '@arcjet/nest';
import { PrismaModule } from './lib/database/prisma.module.js';
import { auth } from './lib/auth/auth.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ArcjetModule.forRootAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        key: configService.getOrThrow<string>('ARCJET_KEY'),
        rules: [
          // Shield protects your app from common attacks (SQL injection, XSS, etc.)
          shield({ mode: 'LIVE' }),
          // Rate limiting: 10 requests per 60 seconds per client
          fixedWindow({
            mode: 'LIVE',
            max: 10,
            window: '60s',
          }),
        ],
      }),
    }),
    PrismaModule,
    AuthModule.forRoot({
      auth,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ArcjetGuard,
    },
  ],
})
export class AppModule {}
