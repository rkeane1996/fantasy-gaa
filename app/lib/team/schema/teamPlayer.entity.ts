import { Prop } from '@nestjs/mongoose';
import { Player } from '../../../lib/player/schema/player.schema';
import { County } from '../../../lib/common/enum/counties';
import { Schema as MongooseSchema } from 'mongoose';

export class TeamPlayer {
  @Prop({
    unique: true,
    required: true,
    type: [{ type: MongooseSchema.Types.ObjectId, ref: Player.name }],
  })
  playerId: Player | string;
  position: string;
  county: County;
  price: number;
  isCaptain: boolean;
  isViceCaptain: boolean;
  isSub: boolean;
}
