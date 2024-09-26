import { IsEnum, IsNumber } from 'class-validator';
import { County } from '../../../../lib/common/enum/counties';
import { Points } from '../../../points/types/points.type';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMatchDto {
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
      points: Points[]; // Points earned by the player in this match
    },
  ];

  @ApiProperty({
    example: 2,
    description: 'The gameweek number that the match is being played in',
  })
  @IsNumber()
  gameweek: number;
}
