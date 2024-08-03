import { Module } from '@nestjs/common';
import { PlayerModule } from './player/player.module';
import { TeamModule } from './team/team.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { LeagueModule } from './league/league.module';
import { AuthModule } from './auth/auth.module';
import { PointsModule } from './points/points.module';

@Module({
  imports: [
    PlayerModule,
    TeamModule,
    UserModule,
    LeagueModule,
    AuthModule,
    PointsModule,
    MongooseModule.forRoot(process.env.USER_DB_CONNECTION_STRING, {
      connectionName: process.env.USER_DB_CONNECTION_NAME,
    }),
    MongooseModule.forRoot(process.env.FANTASY_GAA_DB_CONNECTION_STRING, {
      connectionName: process.env.FANTASY_GAA_DB_CONNECTION_NAME,
    }),
    MongooseModule.forRoot(process.env.POINTS_DB_CONNECTION_STRING, {
      connectionName: process.env.POINTS_DB_CONNECTION_NAME,
    }),
  ],
})
export class AppModule {}
