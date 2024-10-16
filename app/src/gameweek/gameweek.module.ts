import { Module } from '@nestjs/common';
import { GameweekController } from './controller/gameweek.controller';
import { GameweekService } from './service/gameweek.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../../src/user/user.module';
import {
  Gameweek,
  GameweekSchema,
} from '../../lib/gameweek/schema/gameweek.schema';
import { GameweekRepository } from '../../lib/gameweek/repository/gameweek.repository';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Gameweek.name, schema: GameweekSchema }],
      process.env.FANTASY_GAA_DB_CONNECTION_NAME,
    ),
    UserModule,
  ],
  controllers: [GameweekController],
  providers: [GameweekService, GameweekRepository],
  exports: [GameweekService],
})
export class GameweekModule {}
