import { IsNotEmpty, IsString } from 'class-validator';
import { GameweekPointsDTO } from './gameweek-points.dto';
import { ApiProperty } from '@nestjs/swagger';

export class AddPointsDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '234-vdjfk-324',
  })
  id: string;

  @IsNotEmpty()
  @ApiProperty({
    example: { gameweek: 1, gameweekPoints: 34 },
  })
  points: GameweekPointsDTO;
}
