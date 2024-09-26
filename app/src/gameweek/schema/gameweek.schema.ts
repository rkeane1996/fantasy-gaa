import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Gameweek extends Document {
  @Prop({ required: true, unique: true })
  gameweekNumber: number;

  @Prop({ required: false, default: [] })
  matches: string[]; //match object id

  @Prop({ required: true })
  transferDeadline: Date;

  @Prop({ required: true, default: false })
  isActive: boolean;
}

export const GameweekSchema = SchemaFactory.createForClass(Gameweek);
