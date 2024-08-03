import { ClubDTO } from 'lib/common/dto/club.dto';
import { Position } from '../enums/position';

export interface IPlayer {
  playerId: string;
  playerName: string;
  position: Position;
  club: ClubDTO;
}
