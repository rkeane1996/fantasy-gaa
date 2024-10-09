import { Module } from '@nestjs/common';
import { TeamController } from './controller/team.controller';
import { TeamService } from './service/team.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';
import { Team, TeamSchema } from '../../lib/team/schema/team.schema';
import { TeamRepository } from '../../lib/team/repository/team.repository';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Team.name, schema: TeamSchema }],
      process.env.FANTASY_GAA_DB_CONNECTION_NAME,
    ),
    UserModule,
  ],
  controllers: [TeamController],
  providers: [TeamService, TeamRepository],
})
export class TeamModule {}
