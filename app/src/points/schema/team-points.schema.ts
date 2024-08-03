import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TeamPointsDocument = HydratedDocument<TeamPoints>;

@Schema()
export class TeamPoints {
  @Prop({ required: true })
  teamId: string;

  @Prop({ required: true })
  gameweekNumber: number;

  @Prop({ required: true })
  totalPoints: number;

  @Prop({ required: true })
  playerIds: string[];
}

export const TeamPointsSchema = SchemaFactory.createForClass(TeamPoints);
