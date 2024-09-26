import { ApiProperty } from '@nestjs/swagger';

export class GetLeagueResponseDto {
  @ApiProperty({
    example: '123-ijkju-jghj-jhj-45',
  })
  leagueId: string;

  @ApiProperty({
    example: 'The All Ireland Series',
  })
  leagueName: string;

  @ApiProperty({
    example: 'frej564g56894ghj6',
  })
  admin: string;

  @ApiProperty({
    example: 'dew3rf43',
  })
  leagueCode: string;

  @ApiProperty({
    example: ['6578jhy-h65', '7186-frsvbm-715', '585-fvd-456', '123-ferwf-456'],
  })
  teams: string[];

  @ApiProperty({
    example: new Date(),
  })
  createdAt: Date;
}
