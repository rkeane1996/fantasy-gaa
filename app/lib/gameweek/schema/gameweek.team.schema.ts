import { Prop } from '@nestjs/mongoose';
import { TeamPlayer } from '../../../lib/team/schema/teamPlayer.entity';
import { Schema as MongooseSchema } from 'mongoose';
import { Team } from '../../../lib/team/schema/team.schema';

export class GameweekTeam {
  @Prop({
    unique: true,
    required: true,
    type: [{ type: MongooseSchema.Types.ObjectId, ref: Team.name }],
  })
  teamId: Team | string;
  teamPlayers: TeamPlayer[];
}
