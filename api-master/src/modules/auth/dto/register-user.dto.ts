import {
  IsEmail,
  IsString,
  Matches,
  MinLength,
  IsBoolean,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
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
    description:
      "Le mot de passe de l'utilisateur (min. 8 caractères, incluant au moins un chiffre, une majuscule et un symbole spécial)",
    example: 'Password1!',
  })
  @IsString()
  @MinLength(8, {
    message: 'Le mot de passe doit contenir au moins 8 caractères',
  })
  @Matches(/(?=.*[0-9])/, {
    message: 'Le mot de passe doit contenir au moins un chiffre',
  })
  @Matches(/(?=.*[A-Z])/, {
    message: 'Le mot de passe doit contenir au moins une lettre majuscule',
  })
  @Matches(/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/, {
    message: 'Le mot de passe doit contenir au moins un symbole spécial',
  })
  password: string;
}
