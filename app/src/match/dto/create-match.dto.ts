import { IsEnum, IsNumber } from 'class-validator';
import { County } from '../../../lib/common/enum/counties';
import { ApiProperty } from '@nestjs/swagger';
import { PlayerPerformanceDto } from './player-performance.dto';

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
        goals: 0,
        points: 0,
        yellowCards: 0,
        redCards: 0,
        minutes: 0,
        saves: 0,
        penaltySaves: 0,
        hooks: 0,
        blocks: 0,
        totalPoints: 0,
      },
    ],
    description: 'The players that are playing for both the home and away team',
  })
  playerPerformance: PlayerPerformanceDto[];

  @ApiProperty({
    example: 2,
    description: 'The gameweek the match is being played on',
  })
  @IsNumber()
  gameweek: number;
}
