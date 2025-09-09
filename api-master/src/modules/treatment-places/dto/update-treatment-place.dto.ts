import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTreatmentPlaceDto {
  @ApiProperty({
    description: 'The label of the treatment place',
    example: 'Simple treatment place label',
  })
  @IsString()
  @IsOptional()
  readonly label?: string;

  @ApiProperty({
    description: 'The current QR code id of the treatment place',
  })
  @IsUUID()
  @IsOptional()
  readonly current_qr_code_id?: string;
}
