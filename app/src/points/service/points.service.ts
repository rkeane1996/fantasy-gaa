import { Injectable } from '@nestjs/common';
import { AddPlayerGameweekPoints } from '../dto/request/add-player-gameweek-points.dto';
import { AddTeamGameweekPoints } from '../dto/request/add-team-gameweek-points.dto';
import { GetPlayerGameweekPoints } from '../dto/request/get-player-gameweek-points.dto';
import { GetTeamGameweekPoints } from '../dto/request/get-team-gameweek-points.dto';
import { AddPointTypes } from '../dto/request/add-point-type.dto';
import { PointsRepository } from '../repository/points.repository';
import { TeamPoints } from '../schema/team-points.schema';
import { PlayerPoints } from '../schema/player-points.schema';
import { GetGameweekPointsResponse } from '../dto/response/get-gameweek-points.dto';
import { Points } from '../schema/points.schema';

@Injectable()
export class PointsService {
  constructor(readonly pointsRepository: PointsRepository) {}

  async addPlayerPoints(request: AddPlayerGameweekPoints) {
    await this.pointsRepository.insertPlayerPoints(request);
  }

  async lockGameWeekTeam(request: AddTeamGameweekPoints) {
    await this.pointsRepository.lockGameWeekTeam(request);
  }

  async getPlayerPoints(
    request: GetPlayerGameweekPoints,
  ): Promise<GetGameweekPointsResponse> {
    const points = await this.pointsRepository.findPlayerPoints(
      request.playerId,
    );

    const response = new GetGameweekPointsResponse();

    if (!points) {
      return response;
    }

    const gameweekPoints = points.map((gameweekPoint: PlayerPoints) => {
      if (request.gameweekNumber.includes(gameweekPoint.gameweekNumber)) {
        return gameweekPoint;
      }
    });

    if (!gameweekPoints) {
      return response;
    }

    response.points = gameweekPoints.map((gameweekPoint) => {
      let totalPoints = 0;
      gameweekPoint.points.forEach((p) => (totalPoints += p.pointValue));
      return {
        gameweek: gameweekPoint.gameweekNumber,
        points: totalPoints,
        pointTypes: gameweekPoint.points,
      };
    });

    return response;
  }

  async getTeamPoints(
    request: GetTeamGameweekPoints,
  ): Promise<GetGameweekPointsResponse> {
    const points = await this.pointsRepository.findTeamPoints(request.teamId);
    const response = new GetGameweekPointsResponse();
    if (!points) {
      return response;
    }

    const gameweekPoints = points.map((gameweekPoint: TeamPoints) => {
      if (request.gameweekNumber.includes(gameweekPoint.gameweekNumber)) {
        return gameweekPoint;
      }
    });

    if (!gameweekPoints) {
      return response;
    }

    response.points = gameweekPoints.map((_) => {
      return { gameweek: _.gameweekNumber, points: _.totalPoints };
    });

    return response;
  }

  async addPointTypes(request: AddPointTypes) {
    await this.pointsRepository.insertPointType(request);
  }

  async getPointTypes(): Promise<Points[]> {
    const pointTypes = await this.pointsRepository.getPointTypes();
    if (!pointTypes) {
      return [];
    }
    return pointTypes;
  }
}
