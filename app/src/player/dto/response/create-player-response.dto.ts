import { ApiProperty } from '@nestjs/swagger';

export class CreatePlayerResponseDto {
  @ApiProperty({
    example: '123-wer-456-sdr',
  })
  id: string;

  constructor(init?: Partial<CreatePlayerResponseDto>) {
    Object.assign(this, init);
  }
}
