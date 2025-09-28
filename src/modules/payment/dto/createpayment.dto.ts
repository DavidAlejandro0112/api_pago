import { IsNotEmpty, IsNumber, Min, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({
    example: 150.75,
    minimum: 0.01,
    exclusiveMinimum: true,
    type: Number,
  })
  @IsNotEmpty({ message: 'El monto del pago es obligatorio' })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({
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

  @ApiProperty({
    example: 'b2c3d4e5-f6g7-8901-h2i3-j4k5l6m7n8o9',
    format: 'uuid',
  })
  @IsNotEmpty({ message: 'El ID de la tarjeta es obligatorio' })
  @IsString({ message: 'El ID de la tarjeta debe ser una cadena' })
  @Matches(
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
  )
  cardId: string;
}
