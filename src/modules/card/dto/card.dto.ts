import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCardDto {
  @ApiProperty({
    example: '4111111111111111',
    minLength: 16,
    maxLength: 16,
    pattern: '^[0-9]{16}$',
  })
  @IsNotEmpty({ message: 'El número de tarjeta es obligatorio' })
  @IsString({ message: 'El número de tarjeta debe ser una cadena' })
  @Length(16, 16, { message: 'El número de tarjeta debe tener 16 dígitos' })
  @Matches(/^[0-9]{16}$/, {
    message: 'El número de tarjeta debe contener solo dígitos numéricos',
  })
  number: string;

  @ApiProperty({
    example: 'David',
    minLength: 2,
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'El nombre del titular es obligatorio' })
  @IsString({ message: 'El nombre del titular debe ser una cadena' })
  @Length(2, 100, {
    message: 'El nombre del titular debe tener entre 2 y 100 caracteres',
  })
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, {
    message: 'El nombre del titular solo puede contener letras y espacios',
  })
  holderName: string;

  @ApiProperty({
    description: 'ID del usuario propietario de la tarjeta',
    example: 'a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8',
    format: 'uuid',
  })
  @IsNotEmpty({ message: 'El ID de usuario es obligatorio' })
  @IsString({ message: 'El ID de usuario debe ser una cadena' })
  @Matches(
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
    {
      message: 'El ID de usuario debe ser un UUID válido',
    }
  )
  userId: string;
}
