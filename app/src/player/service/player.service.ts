import { Injectable, NotFoundException } from '@nestjs/common';
import { PlayerRepository } from '../repository/player.repository';
import { PlayerDTO } from '../dto/request/add-player-request.dto';
import { County } from '../../../lib/common/enum/counties';
import { FindPlayerResponseDTO } from '../dto/response/get-player-response.dto';
import { CreatePlayerResponseDto } from '../dto/response/create-player-response.dto';

@Injectable()
export class PlayerService {
  constructor(private readonly playerRepo: PlayerRepository) {}

  async addPlayer(dto: PlayerDTO) {
    const { playerId } = await this.playerRepo.createPlayer(dto);
    return new CreatePlayerResponseDto({ id: playerId });
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

  createResponseDto(player) {
    const playerResponse = new FindPlayerResponseDTO();
    playerResponse.playerId = player.playerId;
    playerResponse.playerName = player.playerName;
    playerResponse.position = player.position;
    playerResponse.club = player.club;
    playerResponse.county = player.club.county;
    return playerResponse;
  }
}
