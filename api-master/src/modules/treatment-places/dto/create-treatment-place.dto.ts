import { IsDate, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateTreatmentPlaceDto {
  @ApiProperty({
    description: 'The label of the treatment place',
    example: 'Simple treatment place label',
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
