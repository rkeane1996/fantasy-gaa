import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { PlayerPerformanceDto } from './player-performance.dto';

export class UpdatePlayerPerformanceDto {
  @IsNotEmpty()
  @IsString()
  matchId: string;

  @IsObject()
  @IsNotEmpty()
  playerPerformance: PlayerPerformanceDto;
}
