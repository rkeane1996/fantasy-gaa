import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { County } from '../../../../lib/common/enum/counties';

export class GetMatchResponseDto {
  @ApiProperty({
    example: 'matchid-1',
    description: 'The object id of the match',
  })
  @IsString()
  matchId: string;

  @ApiProperty({
    example: County.Antrim,
    description: 'The team that is playing at home',
  })
  @IsEnum(County)
  homeTeam: County;

  @ApiProperty({
    example: County.Antrim,
    description: 'The team that is playing away from home',
  })
  @IsEnum(County)
  awayTeam: County;

  @ApiProperty({
    example: [
      {
        playerId: 'playerId-1',
        points: [
          {
            pointType: 'SCORED_POINT',
            pointValue: 1,
          },
        ], // Points earned by the player in this match
      },
    ],
    description: 'The players that are playing for both the home and away team',
  })
  players: [
    {
      playerId: string;
      //points: Points[]; // Points earned by the player in this match
    },
  ];

  @ApiProperty({
    example: 2,
    description: 'The gameweek number that the match is being played in',
  })
  @IsNumber()
  gameweek: number;

  @ApiProperty({
    example: '1-20',
    description: 'The scored for home team',
  })
  @IsNumber()
  homeScore: string;

  @ApiProperty({
    example: '1-22',
    description: 'The score for away team',
  })
  @IsNumber()
  awayScore: string;
}
