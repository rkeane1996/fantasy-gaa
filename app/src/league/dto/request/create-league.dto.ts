import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateLeagueDto {
  @ApiProperty({
    example: 'The best league ever',
    description: 'What the league will be called',
  })
  @IsString()
  @IsNotEmpty()
  leagueName: string;

  @ApiProperty({
    example: ['team1', 'team2', 'team3'],
    description: 'The ids of the teams that will be competing in the league',
  })
  @IsArray()
  @IsNotEmpty()
  teams: string[];

  @ApiProperty({
    example: ['user1', 'user2', 'user3'],
    description: 'The ids of the users that will be in the league',
  })
  @IsArray()
  @IsNotEmpty()
  users: string[];
}
