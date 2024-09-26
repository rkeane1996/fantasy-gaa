import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { County } from '../../../lib/common/enum/counties';
import { Points } from '../../../src/points/types/points.type';
import { Document } from 'mongoose';

@Schema()
export class Match extends Document {
  @Prop({ required: true })
  homeTeam: County;

  @Prop({ required: true })
  awayTeam: County;

  @Prop({ required: false, default: '0-00' })
  homeScore: string;

  @Prop({ required: false, default: '0-00' })
  awayScore: string;

  @Prop({ required: true })
  players: [
    {
      playerId: string;
      points: Points[]; // Points earned by the player in this match
    },
  ];

  @Prop({ required: true })
  gameweek: number;
}

export const MatchSchema = SchemaFactory.createForClass(Match);
