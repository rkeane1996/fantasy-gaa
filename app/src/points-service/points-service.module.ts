import { Module } from '@nestjs/common';
import { PointsServiceController } from './controller/points-service.controller';
import { PointsServiceService } from './service/points-service.service';
import { MatchRepository } from '../../lib/match/repository/match.repository';
import { GameweekRepository } from '../../lib/gameweek/repository/gameweek.repository';
import { TeamRepository } from '../../lib/team/repository/team.repository';
import { Team, TeamSchema } from 'lib/team/schema/team.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../../src/user/user.module';
import { Match, MatchSchema } from '../../lib/match/schema/match.schema';
import {
  Gameweek,
  GameweekSchema,
} from '../../lib/gameweek/schema/gameweek.schema';
import { Player, PlayerSchema } from '../../lib/player/schema/player.schema';
import { PlayerRepository } from '../../lib/player/repository/player.repository';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Team.name, schema: TeamSchema },
        { name: Match.name, schema: MatchSchema },
        { name: Gameweek.name, schema: GameweekSchema },
        { name: Player.name, schema: PlayerSchema },
      ],
      process.env.FANTASY_GAA_DB_CONNECTION_NAME,
    ),
    UserModule,
  ],
  controllers: [PointsServiceController],
  providers: [
    PointsServiceService,
    MatchRepository,
    GameweekRepository,
    TeamRepository,
    PlayerRepository,
  ],
})
export class PointsServiceModule {}
