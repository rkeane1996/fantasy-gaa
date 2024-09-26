import { IsNumber, IsString } from 'class-validator';

export class AddGameweekPointsResponseDto {
  @IsString()
  playerId: string;
  @IsNumber()
  totalPoints: number;
  gameweekPoints: [{ gameweek: number; points: number }];
}
