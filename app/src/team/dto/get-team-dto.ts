import { ApiProperty } from '@nestjs/swagger';
import { TeamPlayer } from '../schema/team.schema';
import { Position } from '../../../lib/common/enum/position';
import { County } from '../../../lib/common/enum/counties';

export class GetTeamResponseDto {
  @ApiProperty({
    example: '54g-r43f-43fg-43f',
  })
  teamId: string;

  @ApiProperty({
    example: '543f54-t54g6-43fg-54g54',
  })
  userId: string;

  @ApiProperty({
    example: 'Best Team Ever',
  })
  teamName: string;

  @ApiProperty({
    example: [
      {
        playerId: 'playerid',
        position: Position.DEFENDER,
        county: County.Donegal,
        price: 12.5,
        isCaptain: false,
        isViceCaptain: false,
        isSub: false,
      },
    ],
  })
  players: TeamPlayer[];

  @ApiProperty({
    example: 23.5,
  })
  budget: number;

  @ApiProperty({
    example: 8,
  })
  totalPoints: number;

  @ApiProperty({
    example: [
      {
        gameweek: 1,
        players: [
          {
            playerId: 'playerid',
            position: Position.DEFENDER,
            county: County.Donegal,
            price: 12.5,
            isCaptain: false,
            isViceCaptain: false,
            isSub: false,
          },
        ],
        points: 4,
      },
      {
        gameweek: 2,
        players: [
          {
            playerId: 'playerid',
            position: Position.DEFENDER,
            county: County.Donegal,
            price: 12.5,
            isCaptain: false,
            isViceCaptain: false,
            isSub: false,
          },
        ],
        points: 4,
      },
    ],
  })
  gameweekPoints: [
    { gameweek: number; players: Array<TeamPlayer>; points: number },
  ];
}
