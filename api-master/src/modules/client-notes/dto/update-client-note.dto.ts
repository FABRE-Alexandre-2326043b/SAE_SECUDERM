import { IsString, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateClientNoteDto {
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
