import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { PlayerPerformanceDto } from '../../match/dto/player-performance.dto';

export class UpdatePointsDto {
  @IsNotEmpty()
  @IsString()
  matchId: string;

  @IsObject()
  @IsNotEmpty()
  playerPerformance: PlayerPerformanceDto;
}
