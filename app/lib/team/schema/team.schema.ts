import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TeamInfo } from './teamInfo.entity';
import { TeamPlayer } from './teamPlayer.entity';
import { TeamTransfer } from './teamTransfer.entity';
import { BaseSchema } from '../../../lib/mongo/base.entity';

@Schema({
  versionKey: false,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = doc._id.toString(); // Set id to _id's string value
      delete ret._id; // Remove the _id field
    },
  },
})
export class Team extends BaseSchema {
  @Prop()
  userId: string;

  @Prop({ required: true })
  teamInfo: TeamInfo;

  @Prop({ length: 18 })
  players: Array<TeamPlayer>;

  @Prop({ required: true, min: 0, max: 100.0 })
  budget: number;

  @Prop({ required: false, default: 0 })
  totalPoints: number;

  @Prop({
    default: {
      cost: process.env.COST_OF_TRANSFER,
      limit: process.env.LIMIT_OF_FREE_TRANSFERS,
      made: 0,
      freeTransfers: 0,
    },
  })
  transfers: TeamTransfer;
}

export type TeamDocument = HydratedDocument<Team>;
export const TeamSchema = SchemaFactory.createForClass(Team);
