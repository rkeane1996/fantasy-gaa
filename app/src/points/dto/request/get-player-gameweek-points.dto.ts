import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class GetPlayerGameweekPoints {
  @ApiProperty({
    example: '324-4fvrefv-43fvre-4fre',
  })
  @IsString()
  @IsNotEmpty()
  playerId: string;

  @ApiProperty({
    example: 2,
  })
  @IsNumber()
  @IsNotEmpty()
  gameweekNumber: number[];
}
