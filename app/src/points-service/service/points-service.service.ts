import { Injectable, NotFoundException } from '@nestjs/common';
import { GameweekRepository } from '../../../lib/gameweek/repository/gameweek.repository';
import { MatchRepository } from '../../../lib/match/repository/match.repository';
import { PlayerRepository } from '../../../lib/player/repository/player.repository';
import { TeamRepository } from '../../../lib/team/repository/team.repository';
import { PlayerPerformanceDto } from '../../../src/match/dto/player-performance.dto';
import { plainToInstance } from 'class-transformer';
import { UpdatePointsDto } from '../dto/update-points.dto';
import { Points } from '../../../lib/points/enum/points.enum';

@Injectable()
export class PointsServiceService {
  constructor(
    private readonly matchRepository: MatchRepository,
    private readonly playerRepository: PlayerRepository,
    private readonly gameweekRepository: GameweekRepository,
    private readonly teamRepository: TeamRepository,
  ) {}

  async updatePoints(updatePlayerPerformanceDto: UpdatePointsDto) {
    const match = await this.matchRepository.findMatch(
      updatePlayerPerformanceDto.matchId,
    );

    const player = match.playerPerformance.find(
      (player) =>
        player.playerId ===
        updatePlayerPerformanceDto.playerPerformance.playerId,
    );

    if (!player) {
      throw new NotFoundException(
        `Player with id ${updatePlayerPerformanceDto.playerPerformance.playerId} not play in match with id ${updatePlayerPerformanceDto.matchId}`,
      );
    }

    const teamsThatHavePlayerAndNotOnBench =
      await this.gameweekRepository.getTeamsThatOwnSpecificPlayer(
        match.gameweek,
        player.playerId as string,
      );

    this.updatePlayerPerf(player, updatePlayerPerformanceDto.playerPerformance);

    player.totalPoints = this.calculateTotalPoints(player);

    try {
      // Start updating player performance and player's total points in parallel
      const updatePlayerPerformancePromise =
        await this.matchRepository.updatePlayerPerformance(
          updatePlayerPerformanceDto.matchId,
          player,
        );

      await this.playerRepository.addTotalPoints(
        player.playerId as string,
        player.totalPoints,
      );

      // Update the gameweek points for the teams and team's total points
      for (const team of teamsThatHavePlayerAndNotOnBench) {
        // Update gameweek points for the team
        await this.gameweekRepository.updateGameweekPointsForTeam(
          match.gameweek,
          team.teamId as string,
          player.totalPoints,
        );

        // Update total points for the team
        await this.teamRepository.addTotalPoints(
          team.teamId as string,
          player.totalPoints,
        );
      }

      // Return the updated player performance
      return plainToInstance(
        PlayerPerformanceDto,
        updatePlayerPerformancePromise.playerPerformance.find(
          (p) => p.playerId === player.playerId,
        ),
      );
    } catch (error) {
      // More specific error message and handling
      throw new Error(
        'Error updating player performance or team points: ' + error.message,
      );
    }
  }

  private updatePlayerPerf(
    player: PlayerPerformanceDto,
    performanceDto: PlayerPerformanceDto,
  ) {
    player.goals = performanceDto.goals;
    player.points = performanceDto.points;
    player.minutes = performanceDto.minutes;
    player.redCards = performanceDto.redCards;
    player.yellowCards = performanceDto.yellowCards;
    player.saves = performanceDto.saves;
    player.penaltySaves = performanceDto.penaltySaves;
    player.hooks = performanceDto.hooks;
    player.blocks = performanceDto.blocks;
  }

  /**
   * Helper function to calculate total points based on player stats
   */
  private calculateTotalPoints(player: PlayerPerformanceDto): number {
    const goalPoints = player.goals * Points.GOAL;
    const pointPoints = player.points * Points.POINT;
    const redCardPoints = player.redCards * Points.RED_CARD;
    const yellowCardPoints = player.yellowCards * Points.YELLOW_CARD;
    const savePoints = player.saves * Points.SAVES;
    const penaltySavePoints = player.penaltySaves * Points.PENALTY_SAVE;
    const hookPoints = player.hooks * Points.HOOK;
    const blockPoints = player.blocks * Points.BLOCK;

    const minutesPoints =
      player.minutes >= 50
        ? Points.FULL_GAME_PLAYED
        : Points.LESS_THAN_50_MINS_PLAYED;

    return (
      goalPoints +
      pointPoints +
      redCardPoints +
      yellowCardPoints +
      savePoints +
      penaltySavePoints +
      hookPoints +
      blockPoints +
      minutesPoints
    );
  }
}
