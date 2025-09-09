import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'The old password',
    example: 'oldPassword',
  })
  @IsString()
  readonly oldPassword: string;

  @ApiProperty({
    description: 'The new password',
    example: 'newPassword',
  })
  @IsString()
  readonly newPassword: string;

  @ApiProperty({
    description: 'The code sent to the user email',
    example: '123456',
  })
  @IsString()
  readonly code: string;
}
