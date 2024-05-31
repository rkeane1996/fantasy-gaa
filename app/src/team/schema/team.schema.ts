import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { IGameweekPoints } from 'lib/common/interface/gameweek-points';
import { v4 as uuidv4 } from 'uuid';

export type TeamDocument = HydratedDocument<Team>;

@Schema()
export class Team {
  @Prop({
    required: true,
    unique: true,
    type: String,
    default: () => uuidv4(7),
    index: { unique: true },
  })
  teamId: string;

  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ required: true })
  teamName: string;

  @Prop({ required: true, default: [] })
  players: string[];

  @Prop({ required: false, default: 0 })
  teamPoints: number;

  @Prop({ required: false, default: [] })
  gameweekPoints: IGameweekPoints[];
}

export const TeamSchema = SchemaFactory.createForClass(Team);
