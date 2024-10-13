import { Prop } from '@nestjs/mongoose';
import { Player } from '../../../lib/player/schema/player.schema';
import { Schema as MongooseSchema } from 'mongoose';

export class PlayerPerformance {
  @Prop({
    unique: true,
    required: true,
    type: [{ type: MongooseSchema.Types.ObjectId, ref: Player.name }],
  })
  playerId: Player | string;

  goals: number;
  points: number;
  yellowCards: number;
  redCards: number;
  minutes: number;
  saves: number;
  penaltySaves: number;
  hooks: number;
  blocks: number;
  totalPoints: number;
}
