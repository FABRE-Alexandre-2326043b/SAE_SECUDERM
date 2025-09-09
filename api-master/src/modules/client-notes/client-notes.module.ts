import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ClientNotesController } from './client-notes.controller';
import { ClientNotesService } from './client-notes.service';
import { ClientNotes } from './client-notes.model';
import { QRCode } from '../qrcode/qrcode.model';
import { User } from '../users/users.model';
import { QRCodeModule } from '../qrcode/qrcode.module';
import { TreatmentPlaceModule } from '../treatment-places/treatment-place.module';
import { ShareTreatmentPlaceModule } from '../share-treatment-place/share-treatment-place.module';

@Module({
  imports: [
    QRCodeModule,
    TreatmentPlaceModule,
    ShareTreatmentPlaceModule,
    SequelizeModule.forFeature([ClientNotes, QRCode, User]),
  ],
  controllers: [ClientNotesController],
  providers: [ClientNotesService],
})
export class ClientNotesModule {}
