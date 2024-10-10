import { Module } from '@nestjs/common';
import { LeagueController } from './controller/league.controller';
import { LeagueService } from './service/league.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';
import { LeagueRepository } from '../../lib/league/repository/league.repository';
import { League, LeagueSchema } from '../../lib/league/schema/league.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: League.name, schema: LeagueSchema }],
      process.env.FANTASY_GAA_DB_CONNECTION_NAME,
    ),
    UserModule,
  ],
  controllers: [LeagueController],
  providers: [LeagueService, LeagueRepository],
})
export class LeagueModule {}
