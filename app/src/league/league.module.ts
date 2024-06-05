import { Module } from '@nestjs/common';
import { LeagueController } from './controller/league.controller';
import { LeagueService } from './service/league.service';
import { LeagueRepository } from './repository/league.repository';
import { League, LeagueSchema } from './schema/league.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamModule } from 'src/team/team.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: League.name, schema: LeagueSchema }]),
    UserModule,
  ],
  controllers: [LeagueController],
  providers: [LeagueService, LeagueRepository],
})
export class LeagueModule {}
