import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { County } from '../../../lib/common/enum/counties';
import { PlayerPerformanceDto } from './player-performance.dto';

export class GetMatchResponseDto {
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
        totalPoints: 0,
      },
    ],
    description: 'The players that are playing for both the home and away team',
  })
  playerPerformance: PlayerPerformanceDto[];

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

  @IsString()
  @IsNotEmpty()
  id: string;

  @IsDate()
  @IsNotEmpty()
  dateCreated: Date;

  @ApiProperty({
    example: 2,
    description: 'The gameweek the match is being played on',
  })
  @IsNumber()
  @IsNotEmpty()
  gameweek: number;
}
