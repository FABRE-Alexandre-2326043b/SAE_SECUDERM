import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';

@Injectable()
export class QRService {
  async generateQRCode(data: string): Promise<string> {
    try {
      return QRCode.toDataURL(data);
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new Error('Could not generate QR code');
    }
  }

  async generateQRCodeToFile(data: string, filePath: string): Promise<void> {
    try {
      await QRCode.toFile(filePath, data);
      console.log('QR code saved to:', filePath);
    } catch (error) {
      console.error('Error generating QR code to file:', error);
      throw new Error('Could not save QR code to file');
    }
  }
}
