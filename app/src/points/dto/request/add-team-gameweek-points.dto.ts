import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddTeamGameweekPoints {
  @ApiProperty({
    example: '324-4fvrefv-43fvre-4fre',
  })
  @IsString()
  @IsNotEmpty()
  teamId: string;

  @ApiProperty({
    example: 2,
  })
  @IsNumber()
  @IsNotEmpty()
  gameweekNumber: number;

  @ApiProperty({
    example: 23,
  })
  @IsNumber()
  @IsNotEmpty()
  totalPoints: number;

  @ApiProperty({
    example: ['fre4-fre4-vf4-fv', 'fre-4crf43fv-vr4r-vfe'],
  })
  @IsArray()
  @IsNotEmpty()
  playerIds: string[];
}
