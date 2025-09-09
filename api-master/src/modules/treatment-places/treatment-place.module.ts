import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TreatmentPlaceService } from './treatment-place.service';
import { TreatmentPlaceController } from './treatment-place.controller';
import { TreatmentPlace } from './treatment-place.model';
import { ShareTreatmentPlaceModule } from '../share-treatment-place/share-treatment-place.module';
import { SharedTreatmentPlace } from '../share-treatment-place/shared-treatment-place.model';
import { QRCodeModule } from '../qrcode/qrcode.module';
import { ShareTreatmentPlace } from '../share-treatment-place/share-treatment-place.model';
import { QRCode } from '../qrcode/qrcode.model';
import { ClientNotes } from '../client-notes/client-notes.model';
import { Prescription } from '../prescription/prescription.model';
import { FileModule } from '../file/file.module';

@Module({
  imports: [
    ShareTreatmentPlaceModule,
    QRCodeModule,
    FileModule,
    SequelizeModule.forFeature([
      TreatmentPlace,
      SharedTreatmentPlace,
      ShareTreatmentPlace,
      QRCode,
      ClientNotes,
      Prescription,
    ]),
  ],
  controllers: [TreatmentPlaceController],
  providers: [TreatmentPlaceService],
  exports: [TreatmentPlaceService],
})
export class TreatmentPlaceModule {}
