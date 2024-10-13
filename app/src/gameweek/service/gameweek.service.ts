import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GameweekRepository } from '../repository/gameweek.repository';
import { CreateGameweekDto } from '../dto/request/create-gameweek.dto';
import { Gameweek } from '../schema/gameweek.schema';
import { GetGameweekResponseDto } from '../dto/response/get-gameweek-repsonse.dto';
import { plainToInstance } from 'class-transformer';
import { GameweekActiveResposneDto } from '../dto/response/gameweek-active-response.dto';

@Injectable()
export class GameweekService {
  constructor(private readonly gameweekRepo: GameweekRepository) {}

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

  /* async addMatchToGameweek(
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
  } */

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
