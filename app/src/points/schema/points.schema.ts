import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PointsDocument = HydratedDocument<Points>;

@Schema()
export class Points {
  @Prop({ required: true })
  pointType: string;

  @Prop({ required: true })
  pointDescription: string;

  @Prop({ required: true })
  pointValue: number;
}

export const PointsSchema = SchemaFactory.createForClass(Points);
