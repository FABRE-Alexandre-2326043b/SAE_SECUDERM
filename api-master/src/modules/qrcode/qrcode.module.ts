import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { QRCodeService } from './qrcode.service';
import { QRCodeController } from './qrcode.controller';
import { QRCode } from './qrcode.model';

@Module({
  imports: [SequelizeModule.forFeature([QRCode])],
  controllers: [QRCodeController],
  providers: [QRCodeService],
  exports: [QRCodeService],
})
export class QRCodeModule {}
