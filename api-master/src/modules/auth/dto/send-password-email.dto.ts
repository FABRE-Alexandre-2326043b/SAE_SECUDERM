import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendPasswordEmailDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'user@example.com',
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    description: 'The type of email to send',
    example: 'change',
  })
  @IsString()
  readonly emailType: string;
}
