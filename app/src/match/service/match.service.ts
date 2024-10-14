import { Injectable, NotFoundException } from '@nestjs/common';
import { MatchRepository } from '../../../lib/match/repository/match.repository';
import { CreateMatchDto } from '../dto/create-match.dto';
import { plainToInstance } from 'class-transformer';
import { GetMatchResponseDto } from '../dto/get-match-response.dto';
import { UpdateMatchScoreDto } from '../dto/update-match-score.dto';
import { PlayerPerformanceDto } from '../dto/player-performance.dto';
import { UpdatePlayerPerformanceDto } from '../dto/update-player-performance.dto';
import { Points } from '../../../lib/points/enum/points.enum';
import { PlayerRepository } from '../../../lib/player/repository/player.repository';
import { TeamRepository } from '../../../lib/team/repository/team.repository';

@Injectable()
export class MatchService {
  constructor(
    private readonly matchRepository: MatchRepository,
    private readonly playerRepository: PlayerRepository,
    private readonly teamRepository: TeamRepository,
  ) {}

  async createMatch(createMatchDto: CreateMatchDto) {
    const match = await this.matchRepository.createMatch(createMatchDto);
    return plainToInstance(GetMatchResponseDto, match);
  }

  async updateMatchScore(updateMatchScore: UpdateMatchScoreDto) {
    const { matchId, homeTeamScore, awayTeamScore } = updateMatchScore;
    const updatedMatch = await this.matchRepository.updateMatchScore(
      matchId,
      homeTeamScore,
      awayTeamScore,
    );
    return plainToInstance(GetMatchResponseDto, updatedMatch);
  }

  async getMatch(matchId: string) {
    const match = await this.matchRepository.findMatch(matchId);
    if (!match) {
      throw new NotFoundException(`Match with ${matchId} was not found`);
    }
    return plainToInstance(GetMatchResponseDto, match);
  }

  async getMatchPlayers(matchId: string) {
    const players = await this.matchRepository.findMatchPlayers(matchId);
    if (!players) {
      throw new NotFoundException(`Match with ${matchId} was not found`);
    }
    return plainToInstance(PlayerPerformanceDto, players);
  }

  async updatePlayerPerformance(
    updatePlayerPerformanceDto: UpdatePlayerPerformanceDto,
  ) {
    const match = await this.getMatch(updatePlayerPerformanceDto.matchId);

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

    const currentTotalPoints = player.totalPoints;

    this.updatePlayerPerf(player, updatePlayerPerformanceDto.playerPerformance);

    player.totalPoints = this.calculateTotalPoints(player);

    const totalPointsDifference = player.totalPoints - currentTotalPoints;

    try {
      const [updatedMatch] = await Promise.all([
        // Update player performance in the match
        this.matchRepository.updatePlayerPerformance(
          updatePlayerPerformanceDto.matchId,
          player,
        ),

        // Update player's total points in the player repository
        this.playerRepository.addTotalPoints(
          player.playerId as string,
          totalPointsDifference,
        ),
      ]);

      //From gameweek repo get array of team ids that have thee player id not as a sub
      // then call team repo to update the teams in the array with the points

      return plainToInstance(
        PlayerPerformanceDto,
        updatedMatch.playerPerformance.find(
          (p) => p.playerId === player.playerId,
        ),
      );
    } catch (error) {
      // Handle specific errors here if needed
      throw new Error('Error updating player performance: ' + error.message);
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
