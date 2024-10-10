import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Team } from '../../../lib/team/schema/team.schema';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { generateUniqueCode } from '../utils/generate-league-code';
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
export class League extends BaseSchema {
  @Prop({ required: true })
  leagueName: string;

  @Prop({
    unique: true,
    required: true,
    type: [{ type: MongooseSchema.Types.ObjectId, ref: Team.name }],
  })
  teams: Team[];

  @Prop({ required: true })
  admin: string;

  @Prop({ unique: true, default: generateUniqueCode() })
  leagueCode: string;
}

export type LeagueDocument = HydratedDocument<League>;
export const LeagueSchema = SchemaFactory.createForClass(League);
