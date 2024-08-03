import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { IGameweekPoints } from '../../interface/gameweek-points';
import { ApiProperty } from '@nestjs/swagger';

export class GameweekPointsDTO implements IGameweekPoints {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty({
    example: 1,
  })
  gameweek: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 143,
  })
  gameweekPoints: number;
}
