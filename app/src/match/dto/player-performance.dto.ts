import { IsNotEmpty, IsNumber } from 'class-validator';
import { Player } from '../../../lib/player/schema/player.schema';

export class PlayerPerformanceDto {
  @IsNotEmpty()
  playerId: string | Player;

  @IsNumber()
  @IsNotEmpty()
  goals: number;

  @IsNumber()
  @IsNotEmpty()
  points: number;

  @IsNumber()
  @IsNotEmpty()
  yellowCards: number;

  @IsNumber()
  @IsNotEmpty()
  redCards: number;

  @IsNumber()
  @IsNotEmpty()
  minutes: number;

  @IsNumber()
  @IsNotEmpty()
  saves: number;

  @IsNumber()
  @IsNotEmpty()
  penaltySaves: number;

  @IsNumber()
  @IsNotEmpty()
  hooks: number;

  @IsNumber()
  @IsNotEmpty()
  blocks: number;

  @IsNumber()
  @IsNotEmpty()
  totalPoints: number;
}
