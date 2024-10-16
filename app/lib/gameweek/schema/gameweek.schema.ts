import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from '../../../lib/mongo/base.entity';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Match } from '../../../lib/match/schema/match.schema';
import { GameweekTeam } from './gameweek.team.schema';

@Schema({
  versionKey: false,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = doc._id.toString(); // Set id to _id's string value
      delete ret._id; // Remove the _id field
    },
  },
})
export class Gameweek extends BaseSchema {
  @Prop({ required: true, unique: true })
  gameweekNumber: number;

  @Prop({
    unique: true,
    required: true,
    type: [{ type: MongooseSchema.Types.ObjectId, ref: Match.name }],
  })
  matches: Match[];

  @Prop({ required: false, default: [] })
  gameweekTeams: GameweekTeam[];

  @Prop({ required: true })
  transferDeadline: Date;

  @Prop({ required: false, default: false })
  isActive: boolean;
}

export type GameweekDocument = HydratedDocument<Gameweek>;
export const GameweekSchema = SchemaFactory.createForClass(Gameweek);
