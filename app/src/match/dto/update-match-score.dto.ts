import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateMatchScoreDto {
  @ApiProperty({
    example: 2,
    description: 'The gameweek number',
  })
  @IsString()
  @IsNotEmpty()
  matchId: string;

  @ApiProperty({
    example: '0-10',
    description: 'The score for the home team',
  })
  @IsString()
  @IsNotEmpty()
  homeTeamScore: string;

  @ApiProperty({
    example: '1-12',
    description: 'The score for the away team',
  })
  @IsString()
  @IsNotEmpty()
  awayTeamScore: string;
}
