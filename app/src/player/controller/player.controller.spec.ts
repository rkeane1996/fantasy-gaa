import { Test, TestingModule } from '@nestjs/testing';
import { PlayerController } from './player.controller';
import { PlayerService } from '../service/player.service';
import { CreatePlayerResponseDto } from '../dto/response/create-player-response.dto';
import { FindPlayerResponseDTO } from '../dto/response/get-player-response.dto';
import { PlayerDTO } from '../dto/request/add-player-request.dto';
import { UpdatePlayerInfoDTO } from '../dto/request/update-player-request.dto';
import { UpdatePlayerPriceDTO } from '../dto/request/update-player-price-request.dto';
import { UpdatePlayerStatsDto } from '../dto/request/update-stats-request.dto';
import { AdminAuthGuard } from '../../auth/guards/admin-auth.guard';
import { UserAuthGuard } from '../../auth/guards/user-auth.guard';
import { NotFoundException } from '@nestjs/common';
import { County } from '../../../lib/common/enum/counties';
import { ClubDTO } from '../../../lib/common/dto/club.dto';
import { Position } from '../../../lib/common/enum/position';
import { GAAClub } from '../../../lib/common/enum/club';

describe('PlayerController', () => {
  let controller: PlayerController;
  let playerService: PlayerService;

  const mockPlayerService = {
    addPlayer: jest.fn(),
    updatePlayerInfo: jest.fn(),
    updatePlayerPrice: jest.fn(),
    updatePlayerStatistics: jest.fn(),
    findAllPlayers: jest.fn(),
    getPlayer: jest.fn(),
    getPlayersFromCounty: jest.fn(),
    getPlayersFromClub: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerController],
      providers: [
        {
          provide: PlayerService,
          useValue: mockPlayerService,
        },
      ],
    })
      .overrideGuard(AdminAuthGuard)
      .useValue(jest.fn(() => true))
      .overrideGuard(UserAuthGuard)
      .useValue(jest.fn(() => true))
      .compile();

    controller = module.get<PlayerController>(PlayerController);
    playerService = module.get<PlayerService>(PlayerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addPlayer', () => {
    it('should create and return a new player', async () => {
      const createPlayerDto: PlayerDTO = {
        playerName: 'John Doe',
        county: County.Galway,
        club: { clubName: 'Carnmore' } as ClubDTO,
        position: Position.FORWARD,
        price: 9.5,
        availability: 'Available',
      };

      const expectedResponse = new CreatePlayerResponseDto({ id: '123-abc' });
      mockPlayerService.addPlayer.mockResolvedValue(expectedResponse);

      const result = await controller.addPlayer(createPlayerDto);

      expect(mockPlayerService.addPlayer).toHaveBeenCalledWith(createPlayerDto);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('updatePlayerInfo', () => {
    it('should update and return the player information', async () => {
      const updatePlayerInfoDto: UpdatePlayerInfoDTO = {
        playerId: '123-abc',
        playerName: 'John Doe',
        county: County.Galway,
        club: { clubName: 'Carnmore' } as ClubDTO,
        position: Position.FORWARD,
        availability: 'Available',
      };

      const expectedResponse = new FindPlayerResponseDTO({
        playerId: '123-abc',
        playerName: 'John Doe',
        county: County.Galway,
        position: Position.FORWARD,
        club: { clubName: 'Carnmore' } as ClubDTO,
        price: 9.5,
        availability: 'Available',
        playerStats: {
          goals: 10,
          points: 20,
          yellowCards: 1,
          redCards: 0,
        },
      });

      mockPlayerService.updatePlayerInfo.mockResolvedValue(expectedResponse);

      const result = await controller.updatePlayerInfo(updatePlayerInfoDto);

      expect(mockPlayerService.updatePlayerInfo).toHaveBeenCalledWith(
        updatePlayerInfoDto,
      );
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('updatePlayerPrice', () => {
    it('should update and return the player price', async () => {
      const updatePlayerPriceDto: UpdatePlayerPriceDTO = {
        playerId: '123-abc',
        price: 10.0,
      };

      const expectedResponse = new FindPlayerResponseDTO({
        playerId: '123-abc',
        playerName: 'John Doe',
        county: County.Galway,
        position: Position.FORWARD,
        club: { clubName: 'Carnmore' } as ClubDTO,
        price: 10.0,
        availability: 'Available',
        playerStats: {
          goals: 10,
          points: 20,
          yellowCards: 1,
          redCards: 0,
        },
      });

      mockPlayerService.updatePlayerPrice.mockResolvedValue(expectedResponse);

      const result = await controller.updatePlayerPrice(updatePlayerPriceDto);

      expect(mockPlayerService.updatePlayerPrice).toHaveBeenCalledWith(
        updatePlayerPriceDto.playerId,
        updatePlayerPriceDto.price,
      );
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('updatePlayerStats', () => {
    it('should update and return the player statistics', async () => {
      const updatePlayerStatsDto: UpdatePlayerStatsDto = {
        playerId: '123-abc',
        goals: 3,
        points: 34,
        yellowCards: 2,
        redCards: 1,
      };

      const expectedResponse = new FindPlayerResponseDTO({
        playerId: '123-abc',
        playerName: 'John Doe',
        county: County.Galway,
        position: Position.FORWARD,
        club: { clubName: 'Carnmore' } as ClubDTO,
        price: 9.5,
        availability: 'Available',
        playerStats: {
          goals: 3,
          points: 34,
          yellowCards: 2,
          redCards: 1,
        },
      });

      mockPlayerService.updatePlayerStatistics.mockResolvedValue(
        expectedResponse,
      );

      const result = await controller.updatePlayerStats(updatePlayerStatsDto);

      expect(mockPlayerService.updatePlayerStatistics).toHaveBeenCalledWith(
        updatePlayerStatsDto,
      );
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('getAllPlayers', () => {
    it('should return an array of players', async () => {
      const expectedResponse = [
        new FindPlayerResponseDTO({
          playerId: '123-abc',
          playerName: 'John Doe',
          county: County.Galway,
          position: Position.FORWARD,
          club: { clubName: 'Carnmore' } as ClubDTO,
          price: 9.5,
          availability: 'Available',
          playerStats: {
            goals: 10,
            points: 20,
            yellowCards: 1,
            redCards: 0,
          },
        }),
      ];

      mockPlayerService.findAllPlayers.mockResolvedValue(expectedResponse);

      const result = await controller.getAllPlayers();

      expect(mockPlayerService.findAllPlayers).toHaveBeenCalled();
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('getPlayer', () => {
    it('should return a single player', async () => {
      const playerId = '123-abc';
      const expectedResponse = new FindPlayerResponseDTO({
        playerId: '123-abc',
        playerName: 'John Doe',
        county: County.Galway,
        position: Position.FORWARD,
        club: { clubName: 'Carnmore' } as ClubDTO,
        price: 9.5,
        availability: 'Available',
        playerStats: {
          goals: 10,
          points: 20,
          yellowCards: 1,
          redCards: 0,
        },
      });

      mockPlayerService.getPlayer.mockResolvedValue(expectedResponse);

      const result = await controller.getPlayer(playerId);

      expect(mockPlayerService.getPlayer).toHaveBeenCalledWith(playerId);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('getPlayersByCounty', () => {
    it('should return an array of players from a specific county', async () => {
      const county = County.Galway;
      const expectedResponse = [
        new FindPlayerResponseDTO({
          playerId: '123-abc',
          playerName: 'John Doe',
          county: County.Galway,
          position: Position.FORWARD,
          club: { clubName: 'Carnmore' } as ClubDTO,
          price: 9.5,
          availability: 'Available',
          playerStats: {
            goals: 10,
            points: 20,
            yellowCards: 1,
            redCards: 0,
          },
        }),
      ];

      mockPlayerService.getPlayersFromCounty.mockResolvedValue(
        expectedResponse,
      );

      const result = await controller.getPlayersByCounty(county);

      expect(mockPlayerService.getPlayersFromCounty).toHaveBeenCalledWith(
        county,
      );
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('getPlayersByClub', () => {
    it('should return an array of players from a specific club', async () => {
      const club = GAAClub.Carnmore;
      const expectedResponse = [
        new FindPlayerResponseDTO({
          playerId: '123-abc',
          playerName: 'John Doe',
          county: County.Galway,
          position: Position.FORWARD,
          club: { clubName: 'Carnmore' } as ClubDTO,
          price: 9.5,
          availability: 'Available',
          playerStats: {
            goals: 10,
            points: 20,
            yellowCards: 1,
            redCards: 0,
          },
        }),
      ];

      mockPlayerService.getPlayersFromClub.mockResolvedValue(expectedResponse);

      const result = await controller.getPlayersByClub(club);

      expect(mockPlayerService.getPlayersFromClub).toHaveBeenCalledWith(club);
      expect(result).toEqual(expectedResponse);
    });
  });
});
