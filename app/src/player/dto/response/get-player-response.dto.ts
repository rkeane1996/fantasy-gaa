import { ApiProperty } from '@nestjs/swagger';
import { ClubDTO } from '../../../../lib/common/dto/club.dto';
import { County } from '../../../../lib/common/enum/counties';
import { Position } from '../../../../lib/common/enum/position';
import { PlayerStats } from '../../schema/player.schema';

export class FindPlayerResponseDTO {
  @ApiProperty({
    example: '100-23-23frwe-43v',
  })
  playerId: string;

  @ApiProperty({
    example: 'Ronan Keane',
  })
  playerName: string;
  @ApiProperty({
    example: 'Galway',
  })
  county: County;

  @ApiProperty({
    example: 'Defender',
  })
  position: Position;

  @ApiProperty({
    example: 'Carnmore',
  })
  club: ClubDTO;

  @ApiProperty({
    example: 8.5,
  })
  price: number;

  @ApiProperty({
    example: 'Available',
  })
  availability: string;

  @ApiProperty({
    example: {
      goals: 0,
      points: 0,
      yellowCards: 0,
      redCards: 0,
    },
  })
  playerStats: PlayerStats;

  @ApiProperty({
    example: 8,
  })
  totalPoints: number;

  @ApiProperty({
    example: [
      { gameweek: 1, points: 4 },
      { gameweek: 2, points: 4 },
    ],
  })
  gameweekPoints: [{ gameweek: number; points: number }];

  constructor(init?: Partial<FindPlayerResponseDTO>) {
    Object.assign(this, init);
  }
}
