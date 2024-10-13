import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Position } from '../../../lib/common/enum/position';
import { County } from '../../../lib/common/enum/counties';
import { BaseSchema } from '../../../lib/mongo/base.entity';
import { HydratedDocument } from 'mongoose';
import { Status } from '../constants/status.enum';
import { GAAClub } from '../../../lib/common/enum/club';

@Schema({
  versionKey: false,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = doc._id.toString(); // Set id to _id's string value
      delete ret._id; // Remove the _id field
    },
  },
})
export class Player extends BaseSchema {
  @Prop({ required: true })
  playerName: string;

  @Prop({ required: true })
  profilePictureUrl: string;

  @Prop({ required: true, enum: Position })
  position: Position;

  @Prop({ required: true })
  club: GAAClub;

  @Prop({ required: true })
  county: County;

  @Prop({ default: Status.AVAILABLE })
  status: Status;

  @Prop({ required: true })
  price: number;

  @Prop({ required: false, default: 0 })
  totalPoints: number;
}

export type PlayerDocument = HydratedDocument<Player>;
export const PlayerSchema = SchemaFactory.createForClass(Player);
