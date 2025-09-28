import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'David',
    type: 'string',
    minLength: 2,
    maxLength: 8,
  })
  @IsString()
  @IsNotEmpty({ message: 'The name cannot be empty.' })
  @MinLength(2, { message: 'The name must have at least 2 characters.' })
  @MaxLength(20, { message: 'The name cannot exceed 20 characters.' })
  name: string;
  @ApiProperty({
    description: 'Email',
    example: 'test@test.com',
  })
  @IsEmail({}, { message: 'The email is not valid.' })
  @IsNotEmpty({ message: 'The email cannot be empty.' })
  email: string;
}
