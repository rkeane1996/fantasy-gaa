import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';
import { GameweekTeam } from '../../../../lib/gameweek/schema/gameweek.team.schema';

export class AddTeamsToGameweekDto {
  @ApiProperty({
    example: 2,
    description: 'The gameweek number',
  })
  @IsNumber()
  gameweekNumber: number;

  @ApiProperty({
    example: ['matchid-1', 'matchid-2', 'matchid-3'],
    description: 'The matches that are link to the gameweek',
  })
  @IsArray()
  teams: GameweekTeam[];
}
