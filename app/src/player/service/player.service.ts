import { Injectable, NotFoundException } from '@nestjs/common';
import { PlayerRepository } from '../repository/player.repository';
import { PlayerDTO } from '../dto/request/add-player-request.dto';
import { County } from '../../../lib/common/enum/counties';
import { FindPlayerResponseDTO } from '../dto/response/get-player-response.dto';
import { CreatePlayerResponseDto } from '../dto/response/create-player-response.dto';
import { UpdatePlayerStatsDto } from '../dto/request/update-stats-request.dto';
import { UpdatePlayerInfoDTO } from '../dto/request/update-player-request.dto';
import { Player } from '../schema/player.schema';

@Injectable()
export class PlayerService {
  constructor(private readonly playerRepo: PlayerRepository) {}

  async addPlayer(dto: PlayerDTO) {
    const { id } = await this.playerRepo.createPlayer(dto);
    return new CreatePlayerResponseDto({ id: id });
  }

  async updatePlayerInfo(entity: UpdatePlayerInfoDTO) {
    const updatePlayerInfo = await this.playerRepo.updatePlayerInfo(entity);
    return this.createResponseDto(updatePlayerInfo);
  }

  async updatePlayerPrice(playerId: string, newPrice: number) {
    const updatedPlayerPrice = await this.playerRepo.updatePrice(
      playerId,
      newPrice,
    );
    return this.createResponseDto(updatedPlayerPrice);
  }

  async updatePlayerStatistics(dto: UpdatePlayerStatsDto) {
    const updatePlayerStats = await this.playerRepo.updateStats(dto);
    return this.createResponseDto(updatePlayerStats);
  }

  async updatePlayerPoints(
    playerId: string,
    gameweekNumber: number,
    gamweekPoints: number,
  ) {
    const updatePlayerPoints = await this.playerRepo.updatePoints(
      playerId,
      gameweekNumber,
      gamweekPoints,
    );
    return this.createResponseDto(updatePlayerPoints);
  }

  async findAllPlayers() {
    const players = await this.playerRepo.findAllPlayers();
    if (!players || players.length === 0) {
      return [];
    }
    return players.map((player) => this.createResponseDto(player));
  }

  async getPlayer(playerId: string) {
    const player = await this.playerRepo.findPlayer(playerId);
    if (!player) {
      throw new NotFoundException(`Player was not found by id: ${playerId}`);
    }
    return this.createResponseDto(player);
  }

  async getPlayersFromCounty(county: County) {
    const players = await this.playerRepo.findPlayersByCounty(county);
    if (!players || players.length === 0) {
      return [];
    }
    return players.map((player) => this.createResponseDto(player));
  }

  async getPlayersFromClub(club: string) {
    const players = await this.playerRepo.findPlayersByClub(club);
    if (!players || players.length === 0) {
      return [];
    }
    return players.map((player) => this.createResponseDto(player));
  }

  createResponseDto(player: Player) {
    const playerResponse = new FindPlayerResponseDTO();
    playerResponse.playerId = player._id;
    playerResponse.playerName = player.playerName;
    playerResponse.position = player.position;
    playerResponse.club = player.club;
    playerResponse.county = player.club.county;
    playerResponse.availability = player.availability;
    playerResponse.price = player.price;
    playerResponse.playerStats = player.stats;
    playerResponse.totalPoints = player.totalPoints;
    playerResponse.gameweekPoints = player.gameweekPoints;
    return playerResponse;
  }
}
