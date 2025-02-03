import { Module } from '@nestjs/common';
import { PlayerModule } from './player/player.module';
import { TeamModule } from './team/team.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { LeagueModule } from './league/league.module';
import { AuthModule } from './auth/auth.module';
import { GameweekModule } from './gameweek/gameweek.module';
import { MatchModule } from './match/match.module';
import { PointsServiceModule } from './points-service/points-service.module';
import 'dotenv/config';

@Module({
  imports: [
    PlayerModule,
    TeamModule,
    UserModule,
    LeagueModule,
    AuthModule,
    MongooseModule.forRoot(process.env.FANTASY_GAA_DB_CONNECTION_STRING, {
      connectionName: process.env.FANTASY_GAA_DB_CONNECTION_NAME,
    }),
    GameweekModule,
    MatchModule,
    PointsServiceModule,
  ],
})
export class AppModule {}
