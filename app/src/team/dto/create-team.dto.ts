import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TeamPlayer } from '../schema/team.schema';

export class CreateTeamDTO {
  @ApiProperty({
    example: '234-fgre43rg5-43g',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: 'Best Team Ever',
  })
  @IsString()
  @IsNotEmpty()
  teamName: string;

  @ApiProperty({
    example: [
      {
        playerId: 'r43-gf34-gre',
        position: 'Forward',
        isCaptain: true,
        isViceCaptain: true,
        isSub: false,
      },
    ],
  })
  @Type(() => TeamPlayer)
  @IsNotEmpty()
  players: TeamPlayer[];

  @ApiProperty({
    example: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  budget: number;
}
