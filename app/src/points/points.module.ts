import { Module } from '@nestjs/common';
import { PointsController } from './controller/points.controller';
import { PointsService } from './service/points.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Points, PointsSchema } from './schema/points.schema';
import {
  PlayerPoints,
  PlayerPointsSchema,
} from './schema/player-points.schema';
import { TeamPoints, TeamPointsSchema } from './schema/team-points.schema';
import { PointsRepository } from './repository/points.repository';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature(
      [
        { name: Points.name, schema: PointsSchema },
        { name: PlayerPoints.name, schema: PlayerPointsSchema },
        { name: TeamPoints.name, schema: TeamPointsSchema },
      ],
      process.env.POINTS_DB_CONNECTION_NAME,
    ),
  ],
  controllers: [PointsController],
  providers: [PointsService, PointsRepository],
})
export class PointsModule {}
