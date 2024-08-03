import { ApiProperty } from '@nestjs/swagger';
import { GameweekPoints } from 'src/points/types/gameweekPoints.type';

export class GetGameweekPointsResponse {
  constructor() {
    this.points = [];
  }
  @ApiProperty({
    example: [{ gameweek: 2, points: 23 }],
  })
  points: GameweekPoints[];
}
