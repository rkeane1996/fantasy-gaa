import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class League extends Document {
  @Prop({ required: true })
  leagueName: string;

  @Prop({ unique: true, required: false, default: [] })
  teams: string[];

  @Prop({ required: true })
  admin: string;

  @Prop({ unique: true, default: generateUniqueCode() })
  leagueCode: string;

  @Prop({ required: false, default: new Date() })
  createdAt: Date;
}

export const LeagueSchema = SchemaFactory.createForClass(League);

function generateUniqueCode(): string {
  const timestamp = Date.now().toString(36); // Convert timestamp to base36 string
  const randomNum = Math.random().toString(36).substring(2, 9); // Generate a random base36 string
  return `${timestamp}-${randomNum}`;
}
