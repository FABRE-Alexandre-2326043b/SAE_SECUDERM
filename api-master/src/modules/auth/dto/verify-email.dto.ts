import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'user@example.com',
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password',
  })
  @IsString()
  readonly password: string;

  @ApiProperty({
    description: 'The code sent to the user email',
    example: '123456',
  })
  @IsString()
  readonly code: string;
}
