import { Module } from '@nestjs/common';
import { PlayerController } from './controller/player.controller';
import { PlayerService } from './service/player.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';
import 'dotenv/config';
import { Player, PlayerSchema } from '../../lib/player/schema/player.schema';
import { PlayerRepository } from '../../lib/player/repository/player.repository';
@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Player.name, schema: PlayerSchema }],
      process.env.FANTASY_GAA_DB_CONNECTION_NAME,
    ),
    UserModule,
  ],
  controllers: [PlayerController],
  providers: [PlayerService, PlayerRepository],
  exports: [PlayerService],
})
export class PlayerModule {}
