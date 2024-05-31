import { Module } from '@nestjs/common';
import { TeamController } from './controller/team.controller';
import { TeamService } from './service/team.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Team, TeamSchema } from './schema/team.schema';
import { TeamRepository } from './repository/team.repository';
import { PlayerModule } from 'src/player/player.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Team.name, schema: TeamSchema }]),
    PlayerModule,
  ],
  controllers: [TeamController],
  providers: [TeamService, TeamRepository],
  exports: [TeamService],
})
export class TeamModule {}
