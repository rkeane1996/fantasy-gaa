import { Module } from '@nestjs/common';
import { TeamController } from './controller/team.controller';
import { TeamService } from './service/team.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Team, TeamSchema } from './schema/team.schema';
import { TeamRepository } from './repository/team.repository';
import { PlayerModule } from 'src/player/player.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Team.name, schema: TeamSchema }]),
    PlayerModule,
    UserModule
  ],
  controllers: [TeamController],
  providers: [TeamService, TeamRepository],
})
export class TeamModule {}
