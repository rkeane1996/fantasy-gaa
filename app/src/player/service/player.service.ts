import { Injectable } from '@nestjs/common';
import { CreatePlayerDto } from '../dto/request/add-player-request.dto';
import { County } from '../../../lib/common/enum/counties';
import { FindPlayerResponseDTO } from '../dto/response/get-player-response.dto';
import { plainToInstance } from 'class-transformer';
import { PlayerRepository } from '../../../lib/player/repository/player.repository';
import { UpdatePlayerStatusDto } from '../dto/request/update-player-status-request.dto';
import { UpdatePlayerPriceDto } from '../dto/request/update-player-price-request.dto copy';

@Injectable()
export class PlayerService {
  constructor(private readonly playerRepository: PlayerRepository) {}

  async createPlayer(createPlayerDto: CreatePlayerDto) {
    const player = await this.playerRepository.createPlayer(createPlayerDto);
    return plainToInstance(FindPlayerResponseDTO, player);
  }

  async getAllPlayers() {
    const players = await this.playerRepository.findAllPlayers();
    if (!players || players.length === 0) {
      return [];
    }
    return plainToInstance(FindPlayerResponseDTO, players);
  }

  async getPlayer(playerIds: string[]) {
    const players = await Promise.all(
      playerIds.map(async (playerId) => {
        const playerFound = await this.playerRepository.findPlayer(playerId);
        return playerFound; // Return null if user not found
      }),
    );
    return plainToInstance(FindPlayerResponseDTO, players);
  }

  async getPlayersFromCounty(county: County) {
    const playersFromCounty =
      await this.playerRepository.findPlayersByCounty(county);
    if (!playersFromCounty || playersFromCounty.length === 0) {
      return [];
    }
    return plainToInstance(FindPlayerResponseDTO, playersFromCounty);
  }

  async getPlayersFromClub(club: string) {
    const playersFromClub = await this.playerRepository.findPlayersByClub(club);
    if (!playersFromClub || playersFromClub.length === 0) {
      return [];
    }
    return plainToInstance(FindPlayerResponseDTO, playersFromClub);
  }

  async updatePlayerPrice(updatePlayerPriceDto: UpdatePlayerPriceDto) {
    const updatedPlayer = await this.playerRepository.updatePlayerPrice(
      updatePlayerPriceDto.playerId,
      updatePlayerPriceDto.price,
    );
    return plainToInstance(FindPlayerResponseDTO, updatedPlayer);
  }

  async updatePlayerStatus(updatePlayerStatusDto: UpdatePlayerStatusDto) {
    const updatedPlayer = await this.playerRepository.updatePlayerStatus(
      updatePlayerStatusDto.playerId,
      updatePlayerStatusDto.status,
    );
    return plainToInstance(FindPlayerResponseDTO, updatedPlayer);
  }
}
