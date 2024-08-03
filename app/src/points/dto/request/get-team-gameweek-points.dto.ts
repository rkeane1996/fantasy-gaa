import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class GetTeamGameweekPoints {
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
  gameweekNumber: number[];
}
