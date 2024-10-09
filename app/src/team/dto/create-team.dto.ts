import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsObject, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TeamInfo } from '../../../lib/team/schema/teamInfo.entity';
import { County } from '../../../lib/common/enum/counties';
import { TeamPlayer } from '../../../lib/team/schema/teamPlayer.entity';

export class CreateTeamDTO {
  @ApiProperty({
    example: '234-fgre43rg5-43g',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: {
      teamName: 'TestTeam',
      jerseyColour: 'Blue',
      shortsColour: 'White',
    },
  })
  @IsObject()
  @IsNotEmpty()
  teamInfo: TeamInfo;

  @ApiProperty({
    example: [
      {
        playerId: 'r43-gf34-gre',
        position: 'Forward',
        county: County.Galway,
        price: 12.5,
        isCaptain: true,
        isViceCaptain: true,
        isSub: false,
      },
    ],
  })
  @Type(() => TeamPlayer)
  @IsNotEmpty()
  players: TeamPlayer[];

  @ApiProperty({
    example: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  budget: number;
}
