import { ApiProperty } from '@nestjs/swagger';

export class CardResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  number: string;

  @ApiProperty()
  holderName: string;

  @ApiProperty({
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
    },
  })
  user: {
    id: string;
    name: string;
  };
}
