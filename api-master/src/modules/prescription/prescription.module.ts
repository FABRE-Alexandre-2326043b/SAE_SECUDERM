import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Prescription } from './prescription.model';
import { PrescriptionService } from './prescription.service';
import { PrescriptionController } from './prescription.controller';
import { ShareTreatmentPlaceModule } from '../share-treatment-place/share-treatment-place.module';
import { TreatmentPlaceModule } from '../treatment-places/treatment-place.module';

@Module({
  imports: [
    TreatmentPlaceModule,
    ShareTreatmentPlaceModule,
    SequelizeModule.forFeature([Prescription]),
  ],
  controllers: [PrescriptionController],
  providers: [PrescriptionService],
  exports: [PrescriptionService],
})
export class PrescriptionModule {}
