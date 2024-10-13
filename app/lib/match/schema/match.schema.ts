import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from '../../../lib/mongo/base.entity';
import { HydratedDocument } from 'mongoose';
import { County } from '../../../lib/common/enum/counties';
import { PlayerPerformance } from './player-performance';

@Schema({
  versionKey: false,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = doc._id.toString(); // Set id to _id's string value
      delete ret._id; // Remove the _id field
    },
  },
})
export class Match extends BaseSchema {
  @Prop({ required: true })
  homeTeam: County;

  @Prop({ required: true })
  awayTeam: County;

  @Prop({ required: false, default: '0-00' })
  homeScore: string;

  @Prop({ required: false, default: '0-00' })
  awayScore: string;

  @Prop({ required: true })
  playerPerformance: PlayerPerformance[];
}

export type MatchDocument = HydratedDocument<Match>;
export const MatchSchema = SchemaFactory.createForClass(Match);
