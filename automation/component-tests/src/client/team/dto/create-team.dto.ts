import { Type } from 'class-transformer';
import { ArrayMinSize, IsNotEmpty, IsNumber, IsObject, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { County } from '../../../db/mongodb/types/club.type';
import { IPlayer } from '../../../db/mongodb/types/player.type';

export class CreateTeamRequest {
  userId: string;
  teamInfo: TeamInfo;
  players: TeamPlayer[];
  budget: number;
}

export class TeamPlayer {
  playerId: IPlayer | string;
  position: string;
  county: County;
  price: number;
  isCaptain: boolean;
  isViceCaptain: boolean;
  isSub: boolean;
}

export class TeamInfo {
  teamName: string;
  jerseyColour: string;
  shortsColour: string;
}