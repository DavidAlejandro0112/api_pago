import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Nombre de usuario',
    example: 'David',
    type: 'string',
    minLength: 2,
    maxLength: 8,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
  @MaxLength(8, { message: 'El nombre no puede exceder los 8 caracteres.' })
  name: string;
  @ApiPropertyOptional({
    description: 'Correo',
    example: 'test@test.com',
  })
  @IsEmail({}, { message: 'El correo electrónico no es válido.' })
  @IsOptional()
  email: string;
}
