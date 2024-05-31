import { ApiProperty } from '@nestjs/swagger';

export class GetLeagueResponseDto {
  @ApiProperty({
    example: '123-ijkju-jghj-jhj-45',
  })
  leagueid: string;

  @ApiProperty({
    example: 'The All Ireland Series',
  })
  leagueName: string;

  @ApiProperty({
    example: ['6578jhy-h65', '7186-frsvbm-715', '585-fvd-456', '123-ferwf-456'],
  })
  teams: string[];

  @ApiProperty({
    example: ['6578jhy-h65', '7186-frsvbm-715', '585-fvd-456', '123-ferwf-456'],
  })
  users: string[];

  constructor(init?: Partial<GetLeagueResponseDto>) {
    Object.assign(this, init);
  }
}
