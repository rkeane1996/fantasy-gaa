import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsNotEmpty,
  IsArray,
  IsDate,
  IsBoolean,
} from 'class-validator';
import { GameweekTeam } from '../../../../lib/gameweek/schema/gameweek.team.schema';
import { Match } from '../../../../lib/match/schema/match.schema';
import { County } from '../../../../lib/common/enum/counties';

export class GetGameweekResponseDto {
  @ApiProperty({
    example: 2,
    description:
      'What is the number of the gameweek, is it the 1st, 2nd, 3rd gameweek',
  })
  @IsNumber()
  @IsNotEmpty()
  gameweekNumber: number;

  @ApiProperty({
    example: ['matchid-1', 'matchid-2', 'matchid-3'],
    description: 'The matches that are link to the gameweek',
  })
  @IsArray()
  matches: string[] | Match[];

  @ApiProperty({
    example: [
      {
        teamid: 'team-id-123',
        players: {
          playerId: 'r43-gf34-gre',
          position: 'Forward',
          county: County.Galway,
          price: 5,
          isCaptain: true,
          isViceCaptain: true,
          isSub: false,
        },
      },
    ],
    description: 'The team that are submitted to the gameweek',
  })
  @IsArray()
  gameweekTeams: GameweekTeam[];

  @ApiProperty({
    example: new Date(),
    description:
      'The deadline to which users can make transfers before then gameweek starts',
  })
  @IsDate()
  transferDeadline: Date;

  @ApiProperty({
    example: false,
    description:
      'Indicates if a gameweek is active, only 1 gameweek can be active',
  })
  @IsBoolean()
  isActive: boolean;

  id: string;

  dateCreated: Date;
}
