import { Injectable, NotFoundException } from '@nestjs/common';
import { MatchRepository } from '../../../lib/match/repository/match.repository';
import { CreateMatchDto } from '../dto/create-match.dto';
import { plainToInstance } from 'class-transformer';
import { GetMatchResponseDto } from '../dto/get-match-response.dto';
import { UpdateMatchScoreDto } from '../dto/update-match-score.dto';
import { PlayerPerformanceDto } from '../dto/player-performance.dto';

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
}
