import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ShareTreatmentPlace } from './share-treatment-place.model';
import { ShareTreatmentPlaceService } from './share-treatment-place.service';
import { ShareTreatmentPlaceController } from './share-treatment-place.controller';
import { UsersModule } from '../users/users.module';
import { QRCodeModule } from '../qrcode/qrcode.module';
import { SharedTreatmentPlace } from './shared-treatment-place.model';
import { TreatmentPlace } from '../treatment-places/treatment-place.model';

@Module({
  imports: [
    UsersModule,
    QRCodeModule,
    SequelizeModule.forFeature([
      ShareTreatmentPlace,
      SharedTreatmentPlace,
      TreatmentPlace,
    ]),
  ],
  providers: [ShareTreatmentPlaceService],
  controllers: [ShareTreatmentPlaceController],
  exports: [ShareTreatmentPlaceService],
})
export class ShareTreatmentPlaceModule {}
