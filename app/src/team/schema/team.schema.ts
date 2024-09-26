import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { County } from 'lib/common/enum/counties';
import { Document } from 'mongoose';

export class TeamPlayer {
  playerId: string;
  position: string;
  county: County;
  price: number;
  isCaptain: boolean;
  isViceCaptain: boolean;
  isSub: boolean;
}

@Schema({ timestamps: true })
export class Team extends Document {
  @Prop({ required: true })
  teamName: string;

  @Prop()
  userId: string;

  @Prop({ type: Array<TeamPlayer>, length: 18 })
  players: Array<TeamPlayer>;

  @Prop({ default: 100.0, min: 0, max: 100.0 })
  budget: number;

  @Prop({ required: false, default: 0 })
  totalPoints: number;

  @Prop({ required: false, default: [] })
  gameweek: [{ gameweek: number; players: Array<TeamPlayer>; points: number }];
}

export const TeamSchema = SchemaFactory.createForClass(Team);
