import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { QRCodeModule } from './modules/qrcode/qrcode.module';
import { ClientNotesModule } from './modules/client-notes/client-notes.module';
import { ShareTreatmentPlaceModule } from './modules/share-treatment-place/share-treatment-place.module';
import { FileModule } from './modules/file/file.module';

import { MailService } from './services/email.service';
import { QRService } from './services/qr.service';

import configuration from './config/configuration';
import { databaseConfig } from './config/database.config';
import { jwtConfig } from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { PrescriptionModule } from './modules/prescription/prescription.module';
import { TreatmentPlaceModule } from './modules/treatment-places/treatment-place.module';

import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 600,
        limit: 10,
      },
    ]),
    ConfigModule.forRoot({
      load: [configuration, jwtConfig],
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      useFactory: jwtConfig,
      global: true,
    }),
    SequelizeModule.forRoot(databaseConfig()),
    UsersModule,
    AuthModule,
    QRCodeModule,
    ClientNotesModule,
    PrescriptionModule,
    FileModule,
    ShareTreatmentPlaceModule,
    TreatmentPlaceModule,
  ],
  providers: [
    MailService,
    QRService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [MailService, QRService],
})
export class AppModule {}
