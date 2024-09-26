import { Module } from '@nestjs/common';
import { PointsController } from './controller/points.controller';
import { PointsService } from './service/points.service';
import { UserModule } from '../../src/user/user.module';
import { GameweekModule } from '../../src/gameweek/gameweek.module';
import { PlayerModule } from '../../src/player/player.module';
import { TeamModule } from '../../src/team/team.module';

@Module({
  imports: [UserModule, GameweekModule, PlayerModule, TeamModule],
  controllers: [PointsController],
  providers: [PointsService],
})
export class PointsModule {}
