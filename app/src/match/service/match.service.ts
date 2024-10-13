import { Injectable, NotFoundException } from '@nestjs/common';
import { MatchRepository } from '../../../lib/match/repository/match.repository';
import { CreateMatchDto } from '../dto/create-match.dto';
import { plainToInstance } from 'class-transformer';
import { GetMatchResponseDto } from '../dto/get-match-response.dto';
import { UpdateMatchScoreDto } from '../dto/update-match-score.dto';
import { PlayerPerformanceDto } from '../dto/player-performance.dto';
import { UpdatePlayerPerformanceDto } from '../dto/update-player-performance.dto';
import { Points } from '../../../lib/points/enum/points.enum';

@Injectable()
export class MatchService {
  constructor(private readonly matchRepository: MatchRepository) {}

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

    this.updatePlayerPerf(player, updatePlayerPerformanceDto.playerPerformance);

    player.totalPoints = this.calculateTotalPoints(player);

    const updatedMatch = await this.matchRepository.updatePlayerPerformance(
      updatePlayerPerformanceDto.matchId,
      player,
    );

    return plainToInstance(
      PlayerPerformanceDto,
      updatedMatch.playerPerformance.find(
        (p) => p.playerId === player.playerId,
      ),
    );
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
