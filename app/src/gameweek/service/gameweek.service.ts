import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGameweekDto } from '../dto/request/create-gameweek.dto';
import { GetGameweekResponseDto } from '../dto/response/get-gameweek-repsonse.dto';
import { plainToInstance } from 'class-transformer';
import { GameweekRepository } from '../../../lib/gameweek/repository/gameweek.repository';
import { Gameweek } from '../../../lib/gameweek/schema/gameweek.schema';
import { AddMatchesToGameweekDto } from '../dto/request/add-matches-to-gameweek.dto';
import { AddTeamsToGameweekDto } from '../dto/request/add-teams-to-gameweek.dto';

@Injectable()
export class GameweekService {
  constructor(private readonly gameweekRepository: GameweekRepository) {}

  async createGameWeek(
    createGameweekDto: CreateGameweekDto,
  ): Promise<GetGameweekResponseDto> {
    const gameweek =
      await this.gameweekRepository.createGameWeek(createGameweekDto);
    if (!gameweek) {
      throw new BadRequestException('Unable to Create Gameweek');
    }
    return this.convertToGetGameweekResponse(gameweek);
  }

  async addMatchesToGameweek(
    addMatchesToGameweek: AddMatchesToGameweekDto,
  ): Promise<GetGameweekResponseDto> {
    const gameweek = await this.gameweekRepository.addMatchesToGameweek(
      addMatchesToGameweek.gameweekNumber,
      addMatchesToGameweek.matches,
    );
    return this.convertToGetGameweekResponse(gameweek);
  }

  async lockTeamsForGameweek(
    addMatchesToGameweek: AddTeamsToGameweekDto,
  ): Promise<GetGameweekResponseDto> {
    const gameweek = await this.gameweekRepository.addTeamsToGameweek(
      addMatchesToGameweek.gameweekNumber,
      addMatchesToGameweek.teams,
    );
    return this.convertToGetGameweekResponse(gameweek);
  }

  async getGameWeek(gameweekNumber: number): Promise<GetGameweekResponseDto> {
    const gameweek = await this.gameweekRepository.getGameWeek(gameweekNumber);
    if (!gameweek) {
      throw new NotFoundException(`Gameweek ${gameweekNumber} was not found`);
    }
    return this.convertToGetGameweekResponse(gameweek);
  }

  async getGameWeekMatches(gameweekNumber: number) {
    const matches =
      await this.gameweekRepository.getGameweekMatches(gameweekNumber);
    return matches;
  }

  async getGameWeekMatch(gameweekNumber: number, matchId: string) {
    const match = await this.gameweekRepository.getGameweekMatch(
      gameweekNumber,
      matchId,
    );
    if (!match) {
      throw new NotFoundException(
        `Match ${matchId} was not found in gameweek ${gameweekNumber}`,
      );
    }
    return match;
  }

  async getGameWeekTeams(gameweekNumber: number) {
    const gameweekTeams =
      await this.gameweekRepository.getGameweekTeams(gameweekNumber);
    return gameweekTeams;
  }

  async getGameWeekTeam(gameweekNumber: number, teamId: string) {
    const gameweekTeam = await this.gameweekRepository.getGameweekTeam(
      gameweekNumber,
      teamId,
    );
    if (!gameweekTeam) {
      throw new NotFoundException(
        `Team ${teamId} was not found in gameweek ${gameweekNumber}`,
      );
    }
    return gameweekTeam;
  }

  async activateDeactivateGameweek(gameweekNumber: number, isActive: boolean) {
    const gameweek = await this.gameweekRepository.activateDeactivateGameweek(
      gameweekNumber,
      isActive,
    );
    return this.convertToGetGameweekResponse(gameweek);
  }

  private convertToGetGameweekResponse(
    gameweek: Gameweek,
  ): GetGameweekResponseDto {
    return plainToInstance(GetGameweekResponseDto, gameweek);
  }
}
