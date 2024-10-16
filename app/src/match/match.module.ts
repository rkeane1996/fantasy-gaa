import { Module } from '@nestjs/common';
import { MatchController } from './controller/match.controller';
import { MatchService } from './service/match.service';
import { MatchRepository } from '../../lib/match/repository/match.repository';
import { Match, MatchSchema } from '../../lib/match/schema/match.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';
import { PlayerRepository } from '../../lib/player/repository/player.repository';
import { PlayerSchema, Player } from '../../lib/player/schema/player.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Match.name, schema: MatchSchema },
        { name: Player.name, schema: PlayerSchema },
      ],
      process.env.FANTASY_GAA_DB_CONNECTION_NAME,
    ),
    UserModule,
  ],
  controllers: [MatchController],
  providers: [MatchService, MatchRepository, PlayerRepository],
})
export class MatchModule {}
