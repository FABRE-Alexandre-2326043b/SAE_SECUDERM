import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateQRCodeDto {
  @ApiProperty({
    description: 'The label of the QR code',
    example: 'Simple qr code label',
  })
  @IsString()
  readonly label?: string;
}
