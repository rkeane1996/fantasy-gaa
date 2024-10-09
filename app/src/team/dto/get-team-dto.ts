import { ApiProperty } from '@nestjs/swagger';
import { Position } from '../../../lib/common/enum/position';
import { County } from '../../../lib/common/enum/counties';
import { TeamPlayer } from '../../../lib/team/schema/teamPlayer.entity';
import { TeamInfo } from '../../../lib/team/schema/teamInfo.entity';
import { TeamTransfer } from '../../../lib/team/schema/teamTransfer.entity';

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
    example: {
      teamName: 'Test team',
      jerseyColour: 'Blue',
      shortsColour: 'White',
    },
  })
  teamInfo: TeamInfo;

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

  transfers: TeamTransfer;
}
