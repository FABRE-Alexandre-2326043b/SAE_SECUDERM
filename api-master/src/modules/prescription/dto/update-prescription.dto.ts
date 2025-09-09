import { IsBoolean, IsDate, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePrescriptionDto {
  @ApiProperty({
    description: 'The date of the prescription',
    type: Date,
  })
  @IsDate()
  @Transform(({ value }) => new Date(value))
  readonly date?: Date;

  @ApiProperty({
    description: 'The description of the prescription',
    example: 'Simple prescription description',
  })
  @IsString()
  readonly description?: string;

  @ApiProperty({
    description: 'The state of the prescription',
    example: true,
  })
  @IsBoolean()
  readonly state?: boolean;
}
