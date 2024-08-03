import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { TeamPlayer } from './team-transfer.dto';
import { ApiProperty } from '@nestjs/swagger';

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
    example: ['123f-53bf-4f74', '43bf-fdu5-fg54'],
  })
  @Type(() => TeamPlayer)
  @IsNotEmpty()
  players: string[];
}
