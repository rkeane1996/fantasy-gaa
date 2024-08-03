import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Points } from '../../types/points.type';

export class AddPlayerGameweekPoints {
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
  gameweekNumber: number;

  @ApiProperty({
    example: [{ pointType: 'Point Scored', pointValue: 1 }],
  })
  points: Points[];
}
