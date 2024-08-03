import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ClubDTO } from '../../../lib/common/dto/club.dto';
import { Position } from '../enums/position';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { County } from '../../../lib/common/enum/counties';

export type PlayerDocument = HydratedDocument<Player>;

@Schema()
export class Player {
  @Prop({
    required: true,
    unique: true,
    type: String,
    default: () => uuidv4(7),
    index: { unique: true },
  })
  playerId: string;

  @Prop({ required: true })
  playerName: string;

  @Prop({ required: true, enum: Position })
  position: Position;

  @Prop({ required: true })
  club: ClubDTO;

  @Prop({ required: true })
  county: County;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
