import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
    required: false,
  })
  @IsString()
  readonly first_name?: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
    required: false,
  })
  @IsString()
  readonly last_name?: string;
}
