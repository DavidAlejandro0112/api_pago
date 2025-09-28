import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsStrongPassword } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'email', example: 'test@test.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'password', example: '123.abcd' })
  @Transform(({ value }) => value.trim())
  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;
}
