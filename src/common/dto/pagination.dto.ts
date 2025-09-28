import { Type } from 'class-transformer';
import { IsNumber, IsPositive } from 'class-validator';

export class PaginationDTO {
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  public page?: number = 1;
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  public limit?: number = 10;
}
