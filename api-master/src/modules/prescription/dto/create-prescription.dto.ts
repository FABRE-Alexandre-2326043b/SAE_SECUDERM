import { IsBoolean, IsDate, IsString, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePrescriptionDto {
  @ApiProperty({
    description: 'The Treatment Place ID',
  })
  @IsUUID()
  readonly treatment_place_id: string;

  @ApiProperty({
    description: 'The date of the prescription',
    type: Date,
  })
  @IsDate()
  @Transform(({ value }) => new Date(value))
  readonly date: Date;

  @ApiProperty({
    description: 'The description of the prescription',
    example: 'Simple prescription description',
  })
  @IsString()
  readonly description: string;

  @ApiProperty({
    description: 'The state of the prescription',
    example: false,
  })
  @IsBoolean()
  readonly state: boolean;
}
