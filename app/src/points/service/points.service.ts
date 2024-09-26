import { Injectable } from '@nestjs/common';
import { GameweekService } from '../../../src/gameweek/service/gameweek.service';
import { AddPoints } from '../dto/add-gameweek-points.dto';
import { PlayerService } from '../../../src/player/service/player.service';
import { TeamService } from '../../../src/team/service/team.service';
import { plainToInstance } from 'class-transformer';
import { AddGameweekPointsResponseDto } from '../dto/add-gameweek-points.response.dto';

@Injectable()
export class PointsService {
  constructor(
    private readonly gameweekService: GameweekService,
    private readonly playerService: PlayerService,
    private readonly teamService: TeamService,
  ) {}

  async addPoints(request: AddPoints): Promise<AddGameweekPointsResponseDto> {
    //update match schema
    const updatedMatch =
      await this.gameweekService.updatePlayerPointsScoredInMatch(
        request.playerId,
        request.matchId,
        request.points,
      );

    const totalGameweekPoints = request.points.reduce((total, currentPoint) => {
      return total + currentPoint.pointValue;
    }, 0);
    //update player schema

    const player = await this.playerService.updatePlayerPoints(
      request.playerId,
      updatedMatch.gameweek,
      totalGameweekPoints,
    );

    //update team schema
    const teams = await this.teamService.getTeamByPlayerId(player.playerId);
    teams.forEach(async (team) => {
      const playerIsOnTeam = team.players.find(
        (p) => p.playerId === player.playerId,
      );
      if (!playerIsOnTeam.isSub) {
        await this.teamService.updatePoints(
          team.teamId,
          updatedMatch.gameweek,
          totalGameweekPoints,
        );
      }
    });

    return plainToInstance(AddGameweekPointsResponseDto, {
      playerId: player.playerId,
      totalPoints: player.totalPoints,
      gameweekPoints: player.gameweekPoints,
    });
  }
}
