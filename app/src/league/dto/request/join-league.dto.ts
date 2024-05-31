import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class JoinLeagueDto {
  @ApiProperty({
    example: 'league123',
    description: 'The id of the league that the team wishes to join',
  })
  @IsString()
  @IsNotEmpty()
  leagueId: string;

  @ApiProperty({
    example: 'team1',
    description: 'The id of the team that will be joining the league',
  })
  @IsString()
  @IsNotEmpty()
  teamId: string;

  @ApiProperty({
    example: 'user1',
    description: 'The id of the user that will be joining the league',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
