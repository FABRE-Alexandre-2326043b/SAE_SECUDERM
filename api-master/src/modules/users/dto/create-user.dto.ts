import { IsEmail, IsString, IsEnum } from 'class-validator';
import { UserRole, UserType } from '../enums/user.enums';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'user@example.com',
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
  })
  @IsString()
  readonly first_name: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
  })
  @IsString()
  readonly last_name: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password',
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'The role of the user',
    example: 'admin',
    enum: UserRole,
  })
  @IsEnum(UserRole)
  readonly role: UserRole;

  @ApiProperty({
    description: 'The type of the user',
    example: 'doctor',
    enum: UserType,
  })
  @IsEnum(UserType)
  readonly type: UserType;
}
