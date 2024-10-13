import { Module } from '@nestjs/common';
import { GameweekController } from './controller/gameweek.controller';
import { GameweekService } from './service/gameweek.service';
import { GameweekRepository } from './repository/gameweek.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Gameweek, GameweekSchema } from './schema/gameweek.schema';
import { UserModule } from '../../src/user/user.module';

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
