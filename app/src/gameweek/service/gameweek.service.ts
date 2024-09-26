import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GameweekRepository } from '../repository/gameweek.repository';
import { MatchRepository } from '../repository/match.repository';
import { CreateGameweekDto } from '../dto/request/create-gameweek.dto';
import { Gameweek } from '../schema/gameweek.schema';
import { GetGameweekResponseDto } from '../dto/response/get-gameweek-repsonse.dto';
import { CreateMatchDto } from '../dto/request/create-match.dto';
import { Match } from '../schema/match.schema';
import { plainToInstance } from 'class-transformer';
import { GetMatchResponseDto } from '../dto/response/get-match-response.dto';
import { Points } from '../../../src/points/types/points.type';
import { GameweekActiveResposneDto } from '../dto/response/gameweek-active-response.dto';

@Injectable()
export class GameweekService {
  constructor(
    private readonly gameweekRepo: GameweekRepository,
    private readonly matchRepo: MatchRepository,
  ) {}

  async createGameWeek(
    createGameweekDto: CreateGameweekDto,
  ): Promise<GetGameweekResponseDto> {
    const isGameweekAlreadyCreated = await this.gameweekRepo.getGameWeek(
      createGameweekDto.gameweekNumber,
    );
    if (isGameweekAlreadyCreated) {
      return this.convertToGetGameweekResponse(isGameweekAlreadyCreated);
    }
    const gameweek = await this.gameweekRepo.createGameWeek(createGameweekDto);
    if (!gameweek) {
      throw new BadRequestException('Unable to Create Gameweek');
    }
    return this.convertToGetGameweekResponse(gameweek);
  }

  async getGameWeeks(): Promise<GetGameweekResponseDto[]> {
    const gameweeks = await this.gameweekRepo.getGameWeeks();
    return gameweeks.map((gameweek) =>
      this.convertToGetGameweekResponse(gameweek),
    );
  }

  async getGameWeek(gameweekNumber: number): Promise<GetGameweekResponseDto> {
    const gameweek = await this.gameweekRepo.getGameWeek(gameweekNumber);
    if (!gameweek) {
      throw new NotFoundException(`Gameweek ${gameweekNumber} was not found`);
    }
    return this.convertToGetGameweekResponse(gameweek);
  }

  async startEndGameweek(gameweekNumber: number, isActive: boolean) {
    const gameweek = await this.gameweekRepo.startEndGameweek(
      gameweekNumber,
      isActive,
    );
    return plainToInstance(GameweekActiveResposneDto, {
      Gameweek: gameweek.gameweekNumber,
      IsActive: gameweek.isActive,
    });
  }

  async addMatchToGameweek(
    matches: CreateMatchDto[],
  ): Promise<GetMatchResponseDto[]> {
    const matchesCreated = await Promise.all(
      matches.map(async (match) => {
        return await this.matchRepo.addMatch(match);
      }),
    );

    matchesCreated.forEach(
      async (matchCreated) =>
        await this.gameweekRepo.addMatchToGameweek(
          matchCreated.id,
          matchCreated.gameweek,
        ),
    );
    return matchesCreated.map((match) => this.convertToGetMatchResponse(match));
  }

  async getGameweekMatches(
    gameweekNumber: number,
  ): Promise<GetMatchResponseDto[]> {
    const matches = await this.matchRepo.getGameweekMatches(gameweekNumber);
    return matches.map((match) => this.convertToGetMatchResponse(match));
  }

  async updateMatchScore(
    matchId: string,
    homeScore: string,
    awayScore: string,
  ): Promise<GetMatchResponseDto> {
    const matchUpdated = await this.matchRepo.updateMatchScore(
      matchId,
      homeScore,
      awayScore,
    );
    return this.convertToGetMatchResponse(matchUpdated);
  }

  async updatePlayerPointsScoredInMatch(
    playerId: string,
    matchId: string,
    points: Points[],
  ) {
    return await this.matchRepo.updatePlayerPoints(playerId, matchId, points);
  }

  private convertToGetMatchResponse(match: Match): GetMatchResponseDto {
    return plainToInstance(GetMatchResponseDto, {
      id: match._id,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      homeScore: match.homeScore,
      awayScore: match.awayScore,
      players: match.players,
      gameweek: match.gameweek,
    });
  }

  private convertToGetGameweekResponse(
    gameweek: Gameweek,
  ): GetGameweekResponseDto {
    return plainToInstance(GetGameweekResponseDto, {
      id: gameweek._id,
      gameweekNumber: gameweek.gameweekNumber,
      matches: gameweek.matches,
      transferDeadline: gameweek.transferDeadline,
      isActive: gameweek.isActive,
    });
  }
}
