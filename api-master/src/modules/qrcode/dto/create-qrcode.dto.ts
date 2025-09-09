import { IsString, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQRCodeDto {
  @ApiProperty({
    description: 'The label of the QR code',
    example: 'Simple qr code label',
  })
  @IsString()
  readonly label: string;

  @ApiProperty({
    description: 'The reference of the product',
    example: 'KIT XL',
  })
  @IsString()
  readonly ref_product: string;

  @ApiProperty({
    description: 'The dimension of the product',
    example: '20*50cm',
  })
  @IsString()
  readonly dimension: string;

  @ApiProperty({
    description: 'The number in the lot of the product',
    example: '1',
  })
  @IsString()
  readonly number_in_lot: string;

  @ApiProperty({
    description: 'The lot number of the product',
    example: '01/01/1111',
  })
  @IsString()
  readonly lot_number: string;

  @ApiProperty({
    description: 'The expiration date of the product',
    example: '01/01/1111',
  })
  @IsDate()
  @Transform(({ value }) => new Date(value))
  readonly expiration_date: Date;
}
