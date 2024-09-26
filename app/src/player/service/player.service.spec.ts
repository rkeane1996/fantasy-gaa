import { Test, TestingModule } from '@nestjs/testing';
import { PlayerService } from './player.service';
import { PlayerRepository } from '../repository/player.repository';
import { PlayerDTO } from '../dto/request/add-player-request.dto';
import { UpdatePlayerInfoDTO } from '../dto/request/update-player-request.dto';
import { UpdatePlayerStatsDto } from '../dto/request/update-stats-request.dto';
import { County } from '../../../lib/common/enum/counties';
import { Position } from '../../../lib/common/enum/position';
import { FindPlayerResponseDTO } from '../dto/response/get-player-response.dto';
import { CreatePlayerResponseDto } from '../dto/response/create-player-response.dto';
import { NotFoundException } from '@nestjs/common';
import { PlayerStats } from '../schema/player.schema';
import { GAAClub } from '../../../lib/common/enum/club';

describe('PlayerService', () => {
  let service: PlayerService;
  let repository: PlayerRepository;

  const mockPlayerRepo = {
    createPlayer: jest.fn(),
    updatePlayerInfo: jest.fn(),
    updatePrice: jest.fn(),
    updateStats: jest.fn(),
    findAllPlayers: jest.fn(),
    findPlayer: jest.fn(),
    findPlayersByCounty: jest.fn(),
    findPlayersByClub: jest.fn(),
  };

  const mockPlayer = {
    _id: '1',
    id: '1',
    playerName: 'John Doe',
    position: Position.FORWARD,
    club: { clubName: 'Carnmore', county: County.Galway },
    county: County.Galway,
    availability: 'Available',
    price: 1000,
    stats: {
      goals: 10,
      points: 20,
      yellowCards: 1,
      redCards: 0,
    } as PlayerStats,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerService,
        { provide: PlayerRepository, useValue: mockPlayerRepo },
      ],
    }).compile();

    service = module.get<PlayerService>(PlayerService);
    repository = module.get<PlayerRepository>(PlayerRepository);
  });

  describe('addPlayer', () => {
    it('should successfully add a player and return the response DTO', async () => {
      const dto: PlayerDTO = {
        playerName: 'John Doe',
        county: County.Galway,
        club: { clubName: GAAClub.Carnmore, county: County.Galway },
        position: Position.FORWARD,
        price: 1000,
        availability: 'Available',
      };
      mockPlayerRepo.createPlayer.mockResolvedValue({ id: '1' } as any);

      const result = await service.addPlayer(dto);
      expect(result).toEqual(new CreatePlayerResponseDto({ id: '1' }));
    });
  });

  describe('updatePlayerInfo', () => {
    it('should successfully update player info and return the response DTO', async () => {
      const dto: UpdatePlayerInfoDTO = {
        playerId: '1',
        playerName: 'John Doe Updated',
        county: County.Galway,
        club: { clubName: GAAClub.Carnmore, county: County.Galway },
        position: Position.FORWARD,
        availability: 'Available',
      };
      mockPlayerRepo.updatePlayerInfo.mockResolvedValue({
        ...mockPlayer,
        playerName: dto.playerName,
      } as any);

      const result = await service.updatePlayerInfo(dto);
      expect(result).toEqual(
        new FindPlayerResponseDTO({
          playerId: '1',
          playerName: 'John Doe Updated',
          county: County.Galway,
          position: Position.FORWARD,
          club: { clubName: GAAClub.Carnmore, county: County.Galway },
          price: 1000,
          availability: 'Available',
          playerStats: mockPlayer.stats,
        }),
      );
    });
  });

  describe('updatePlayerPrice', () => {
    it('should successfully update player price and return the response DTO', async () => {
      const playerId = '1';
      const newPrice = 1500;
      mockPlayerRepo.updatePrice.mockResolvedValue({
        ...mockPlayer,
        price: newPrice,
      } as any);

      const result = await service.updatePlayerPrice(playerId, newPrice);
      expect(result).toEqual(
        new FindPlayerResponseDTO({
          playerId: '1',
          playerName: 'John Doe',
          county: County.Galway,
          position: Position.FORWARD,
          club: { clubName: GAAClub.Carnmore, county: County.Galway },
          price: newPrice,
          availability: 'Available',
          playerStats: mockPlayer.stats,
        }),
      );
    });
  });

  describe('updatePlayerStatistics', () => {
    it('should successfully update player statistics and return the response DTO', async () => {
      const dto: UpdatePlayerStatsDto = {
        playerId: '1',
        goals: 15,
        points: 30,
        yellowCards: 2,
        redCards: 1,
      };
      mockPlayerRepo.updateStats.mockResolvedValue({
        ...mockPlayer,
        stats: {
          goals: 15,
          points: 30,
          yellowCards: 2,
          redCards: 1,
        } as PlayerStats,
      } as any);

      const result = await service.updatePlayerStatistics(dto);
      expect(result).toEqual(
        new FindPlayerResponseDTO({
          playerId: '1',
          playerName: 'John Doe',
          county: County.Galway,
          position: Position.FORWARD,
          club: { clubName: GAAClub.Carnmore, county: County.Galway },
          price: 1000,
          availability: 'Available',
          playerStats: { goals: 15, points: 30, yellowCards: 2, redCards: 1 },
        }),
      );
    });
  });

  describe('findAllPlayers', () => {
    it('should return an array of player response DTOs when players are found', async () => {
      mockPlayerRepo.findAllPlayers.mockResolvedValue([mockPlayer] as any);

      const result = await service.findAllPlayers();
      expect(result).toEqual([
        new FindPlayerResponseDTO({
          playerId: '1',
          playerName: 'John Doe',
          county: County.Galway,
          position: Position.FORWARD,
          club: { clubName: GAAClub.Carnmore, county: County.Galway },
          price: 1000,
          availability: 'Available',
          playerStats: mockPlayer.stats,
        }),
      ]);
    });

    it('should return an empty array when no players are found', async () => {
      mockPlayerRepo.findAllPlayers.mockResolvedValue([] as any);

      const result = await service.findAllPlayers();
      expect(result).toEqual([]);
    });
  });

  describe('getPlayer', () => {
    it('should return player response DTO when player is found', async () => {
      const playerId = '1';
      mockPlayerRepo.findPlayer.mockResolvedValue(mockPlayer as any);

      const result = await service.getPlayer(playerId);
      expect(result).toEqual(
        new FindPlayerResponseDTO({
          playerId: '1',
          playerName: 'John Doe',
          county: County.Galway,
          position: Position.FORWARD,
          club: { clubName: GAAClub.Carnmore, county: County.Galway },
          price: 1000,
          availability: 'Available',
          playerStats: mockPlayer.stats,
        }),
      );
    });

    it('should throw NotFoundException when player is not found', async () => {
      const playerId = '1';
      mockPlayerRepo.findPlayer.mockResolvedValue(null);

      await expect(service.getPlayer(playerId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getPlayersFromCounty', () => {
    it('should return an array of player response DTOs when players from county are found', async () => {
      mockPlayerRepo.findPlayersByCounty.mockResolvedValue([mockPlayer] as any);

      const result = await service.getPlayersFromCounty(County.Galway);
      expect(result).toEqual([
        new FindPlayerResponseDTO({
          playerId: '1',
          playerName: 'John Doe',
          county: County.Galway,
          position: Position.FORWARD,
          club: { clubName: GAAClub.Carnmore, county: County.Galway },
          price: 1000,
          availability: 'Available',
          playerStats: mockPlayer.stats,
        }),
      ]);
    });

    it('should return an empty array when no players from county are found', async () => {
      mockPlayerRepo.findPlayersByCounty.mockResolvedValue([] as any);

      const result = await service.getPlayersFromCounty(County.Galway);
      expect(result).toEqual([]);
    });
  });

  describe('getPlayersFromClub', () => {
    it('should return an array of player response DTOs when players from club are found', async () => {
      mockPlayerRepo.findPlayersByClub.mockResolvedValue([mockPlayer] as any);

      const result = await service.getPlayersFromClub('Carnmore');
      expect(result).toEqual([
        new FindPlayerResponseDTO({
          playerId: '1',
          playerName: 'John Doe',
          county: County.Galway,
          position: Position.FORWARD,
          club: { clubName: GAAClub.Carnmore, county: County.Galway },
          price: 1000,
          availability: 'Available',
          playerStats: mockPlayer.stats,
        }),
      ]);
    });

    it('should return an empty array when no players from club are found', async () => {
      mockPlayerRepo.findPlayersByClub.mockResolvedValue([] as any);

      const result = await service.getPlayersFromClub('Carnmore');
      expect(result).toEqual([]);
    });
  });
});
