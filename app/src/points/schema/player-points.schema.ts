import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Points } from '../types/points.type';

export type PlayerPointsDocument = HydratedDocument<PlayerPoints>;

@Schema()
export class PlayerPoints {
  @Prop({ required: true })
  playerId: string;

  @Prop({ required: true })
  gameweekNumber: number;

  @Prop({ required: true })
  points: Points[];
}

export const PlayerPointsSchema = SchemaFactory.createForClass(PlayerPoints);
