import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddShareTreatmentPlaceDto {
  @ApiProperty({
    description: 'The verification code to add the QR code',
    example: '123456',
  })
  @IsString()
  verification_code: string;
}
