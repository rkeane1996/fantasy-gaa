import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayerModule } from './player/player.module';
import { TeamModule } from './team/team.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { LeagueModule } from './league/league.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PlayerModule,
    TeamModule,
    UserModule,
    MongooseModule.forRoot('mongodb://localhost:27017/fantasy-gaa'),
    LeagueModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
