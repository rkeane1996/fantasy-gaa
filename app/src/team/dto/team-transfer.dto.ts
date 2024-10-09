import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { County } from '../../../lib/common/enum/counties';
import { TeamPlayer } from '../../../lib/team/schema/teamPlayer.entity';

export class TeamTransferDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'h768-f687-s21-vr45v',
  })
  teamId: string;

  @IsArray()
  @Type(() => Array<TeamPlayer>)
  @IsNotEmpty()
  @ApiProperty({
    example: [
      {
        playerId: 'r43-gf34-gre',
        position: 'Forward',
        county: County.Galway,
        price: 5,
        isCaptain: true,
        isViceCaptain: true,
        isSub: false,
      },
    ],
  })
  playersToAdd: TeamPlayer[];

  @IsArray()
  @Type(() => Array<TeamPlayer>)
  @IsNotEmpty()
  @ApiProperty({
    example: [
      {
        playerId: 'r43-gf34-gre',
        position: 'Forward',
        county: County.Galway,
        price: 5,
        isCaptain: true,
        isViceCaptain: true,
        isSub: false,
      },
    ],
  })
  playersToReplace: TeamPlayer[];
}
