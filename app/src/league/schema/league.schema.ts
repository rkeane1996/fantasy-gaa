import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema()
export class League {
  @Prop({
    required: true,
    unique: true,
    type: String,
    default: () => uuidv4(7),
    index: { unique: true },
  })
  leagueid: string;

  @Prop({ required: true })
  leagueName: string;

  @Prop({ required: false, default: [] })
  teams: string[];

  @Prop({ required: false, default: [] })
  users: string[];
}

export type LeagueDocument = HydratedDocument<League>;
export const LeagueSchema = SchemaFactory.createForClass(League);
