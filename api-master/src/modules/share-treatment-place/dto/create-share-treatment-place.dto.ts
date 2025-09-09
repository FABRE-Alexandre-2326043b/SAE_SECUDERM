import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateShareTreatmentPlaceDto {
  @ApiProperty({
    description: 'The Treatment Place ID',
    example: 'uuid',
  })
  @IsUUID()
  treatment_place_id: string;
}
