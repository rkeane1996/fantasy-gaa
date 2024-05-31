import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ClubDTO } from 'lib/common/dto/club.dto';
import { Position } from 'src/player/enums/position';
import { HydratedDocument } from 'mongoose';
import { IGameweekPoints } from 'lib/common/interface/gameweek-points';
import { v4 as uuidv4 } from 'uuid';

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
  totalPoints: number;

  @Prop({ required: true })
  gameweekPoints: IGameweekPoints[];
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
