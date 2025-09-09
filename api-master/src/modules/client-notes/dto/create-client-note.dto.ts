import { IsUUID, IsString, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClientNoteDto {
  @ApiProperty({
    description: 'The Treatment Place ID',
  })
  @IsUUID()
  readonly treatment_place_id: string;

  @ApiProperty({
    description: 'Date of the note',
    type: Date,
  })
  @IsDate()
  @Transform(({ value }) => new Date(value))
  readonly date: Date;

  @ApiProperty({
    description: 'Description of the note',
    example: 'Simple note description',
  })
  @IsString()
  readonly description: string;
}
