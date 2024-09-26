import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ClubDTO } from '../../../lib/common/dto/club.dto';
import { Position } from '../../../lib/common/enum/position';
import { County } from '../../../lib/common/enum/counties';
import { Document } from 'mongoose';

export class PlayerStats {
  goals: number;
  points: number;
  yellowCards: number;
  redCards: number;
}

@Schema()
export class Player extends Document {
  @Prop({ required: true })
  playerName: string;

  @Prop({ required: true, enum: Position })
  position: Position;

  @Prop({ required: true })
  club: ClubDTO;

  @Prop({ required: true })
  county: County;

  @Prop({ default: 'Available' })
  availability: string;

  @Prop({ required: false, default: new PlayerStats() })
  stats: PlayerStats;

  @Prop({ required: true })
  price: number;

  @Prop({ required: false, default: 0 })
  totalPoints: number;

  @Prop({ required: false, default: [] })
  gameweekPoints: [{ gameweek: number; points: number }];
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
