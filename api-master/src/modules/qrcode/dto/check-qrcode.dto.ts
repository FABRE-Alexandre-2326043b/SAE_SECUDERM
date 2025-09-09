import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CheckQrcodeDto {
  @ApiProperty({
    description: 'The number in the lot of the product',
    example: '1',
  })
  @IsString()
  readonly number_in_lot: string;

  @ApiProperty({
    description: 'The reference of the product',
    example: 'KIT XL',
  })
  @IsString()
  readonly ref_product: string;

  @ApiProperty({
    description: 'The lot number of the product',
    example: '01/01/1111',
  })
  @IsString()
  readonly lot_number: string;
}
