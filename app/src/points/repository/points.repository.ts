import { InjectModel } from '@nestjs/mongoose';
import { Points, PointsDocument } from '../schema/points.schema';
import { Model } from 'mongoose';
import {
  PlayerPoints,
  PlayerPointsDocument,
} from '../schema/player-points.schema';
import { TeamPoints, TeamPointsDocument } from '../schema/team-points.schema';
import { AddPlayerGameweekPoints } from '../dto/request/add-player-gameweek-points.dto';
import { AddTeamGameweekPoints } from '../dto/request/add-team-gameweek-points.dto';
import { AddPointTypes } from '../dto/request/add-point-type.dto';
import { ITeamPoints } from '../interface/team-points.interface';
import { IPlayerPoints } from '../interface/player-points.interface';
import { IPoints } from '../interface/points.interface';

export class PointsRepository {
  constructor(
    @InjectModel(Points.name, process.env.POINTS_DB_CONNECTION_NAME)
    private readonly pointsModel: Model<PointsDocument>,
    @InjectModel(PlayerPoints.name, process.env.POINTS_DB_CONNECTION_NAME)
    private readonly playerPointsModel: Model<PlayerPointsDocument>,
    @InjectModel(TeamPoints.name, process.env.POINTS_DB_CONNECTION_NAME)
    private readonly teamPointsModel: Model<TeamPointsDocument>,
  ) {}

  async insertPlayerPoints(
    entity: AddPlayerGameweekPoints,
  ): Promise<AddPlayerGameweekPoints> {
    return await this.playerPointsModel.create({ entity });
  }

  async lockGameWeekTeam(
    entity: AddTeamGameweekPoints,
  ): Promise<AddTeamGameweekPoints> {
    return await this.teamPointsModel.create({ entity });
  }

  async insertPointType(entity: AddPointTypes): Promise<AddPointTypes> {
    return await this.pointsModel.create({ entity });
  }

  async findTeamPoints(teamId: string): Promise<ITeamPoints[]> {
    return await this.teamPointsModel.find({ teamId }).lean();
  }
  t;

  async findPlayerPoints(playerId: string): Promise<IPlayerPoints[]> {
    return await this.playerPointsModel.find({ playerId }).lean();
  }

  async getPointTypes(): Promise<IPoints[]> {
    return await this.pointsModel.find().lean();
  }

  async getGameweekTeamPlayers(
    teamId: string,
    gameweek: number,
  ): Promise<ITeamPoints> {
    const filterTeamId = { teamId: teamId };
    const filterGameweek = { gameweek: gameweek };
    const query = { $and: [filterTeamId, filterGameweek] };
    return await this.teamPointsModel.find(query).lean();
  }
}
