import { ApiProperty } from '@nestjs/swagger';

export class CreateLeagueResponseDto {
  @ApiProperty({
    example: '123-wer-456-sdr',
  })
  id: string;

  constructor(init?: Partial<CreateLeagueResponseDto>) {
    Object.assign(this, init);
  }
}
