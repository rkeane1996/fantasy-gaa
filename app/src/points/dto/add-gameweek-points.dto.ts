import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Points } from '../types/points.type';

export class AddPoints {
  @ApiProperty({
    example: '324-4fvrefv-43fvre-4fre',
  })
  @IsString()
  @IsNotEmpty()
  playerId: string;

  @ApiProperty({
    example: '324-4fvrefv-43fvre-4fre',
  })
  @IsString()
  @IsNotEmpty()
  matchId: string;

  @ApiProperty({
    example: [{ pointType: 'Point Scored', pointValue: 1 }],
  })
  points: Points[];
}
