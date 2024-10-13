import { Test, TestingModule } from '@nestjs/testing';
import { PlayerService } from './player.service';
import { PlayerRepository } from '../../../lib/player/repository/player.repository';
import { NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from '../dto/request/add-player-request.dto';
import { FindPlayerResponseDTO } from '../dto/response/get-player-response.dto';
import { County } from '../../../lib/common/enum/counties';
import { plainToInstance } from 'class-transformer';
import { UpdatePlayerStatusDto } from '../dto/request/update-player-status-request.dto';
import { Status } from '../../../lib/player/constants/status.enum';
import { GAAClub } from '../../../lib/common/enum/club';
import { Position } from '../../../lib/common/enum/position';
import { UpdatePlayerPriceDto } from '../dto/request/update-player-price-request.dto copy';

describe('PlayerService', () => {
  let playerService: PlayerService;
  let playerRepository: PlayerRepository;

  const mockPlayerRepository = {
    createPlayer: jest.fn(),
    findAllPlayers: jest.fn(),
    findPlayer: jest.fn(),
    findPlayersByCounty: jest.fn(),
    findPlayersByClub: jest.fn(),
    updatePlayerPrice: jest.fn(),
    updatePlayerStatus: jest.fn(),
  };

  const mockPlayer = {
    playerName: 'John Doe',
    profilePictureUrl: 'www.picurl.com',
    county: County.Galway,
    club: 'Carnmore',
    position: 'Forward',
    price: 8.5,
    status: Status.AVAILABLE,
    id: '12345',
    dateCreated: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerService,
        {
          provide: PlayerRepository,
          useValue: mockPlayerRepository,
        },
      ],
    }).compile();

    playerService = module.get<PlayerService>(PlayerService);
    playerRepository = module.get<PlayerRepository>(PlayerRepository);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear all mocks after each test
  });

  describe('createPlayer', () => {
    it('should create and return a player', async () => {
      const createPlayerDto: CreatePlayerDto = {
        playerName: 'John Doe',
        profilePictureUrl: 'www.picurl.com',
        county: County.Galway,
        club: GAAClub.Carnmore,
        position: Position.FORWARD,
        price: 8.5,
        status: Status.AVAILABLE,
      };

      mockPlayerRepository.createPlayer.mockResolvedValue(mockPlayer);

      const result = await playerService.createPlayer(createPlayerDto);

      expect(result).toEqual(plainToInstance(FindPlayerResponseDTO, mockPlayer));
      expect(playerRepository.createPlayer).toHaveBeenCalledWith(createPlayerDto);
    });
  });

  describe('getAllPlayers', () => {
    it('should return an array of players', async () => {
      mockPlayerRepository.findAllPlayers.mockResolvedValue([mockPlayer]);

      const result = await playerService.getAllPlayers();

      expect(result).toEqual(plainToInstance(FindPlayerResponseDTO, [mockPlayer]));
      expect(playerRepository.findAllPlayers).toHaveBeenCalled();
    });

    it('should return an empty array if no players exist', async () => {
      mockPlayerRepository.findAllPlayers.mockResolvedValue([]);

      const result = await playerService.getAllPlayers();

      expect(result).toEqual([]);
      expect(playerRepository.findAllPlayers).toHaveBeenCalled();
    });
  });

  describe('getPlayer', () => {
    it('should return a player by ID', async () => {
      const playerId = '12345';
      mockPlayerRepository.findPlayer.mockResolvedValue(mockPlayer);

      const result = await playerService.getPlayer(playerId);

      expect(result).toEqual(plainToInstance(FindPlayerResponseDTO, mockPlayer));
      expect(playerRepository.findPlayer).toHaveBeenCalledWith(playerId);
    });

    it('should throw NotFoundException if player is not found', async () => {
      const playerId = '12345';
      mockPlayerRepository.findPlayer.mockResolvedValue(null);

      await expect(playerService.getPlayer(playerId)).rejects.toThrow(
        new NotFoundException(`Player was not found by id: ${playerId}`),
      );

      expect(playerRepository.findPlayer).toHaveBeenCalledWith(playerId);
    });
  });

  describe('getPlayersFromCounty', () => {
    it('should return players from a county', async () => {
      const county = County.Galway;
      mockPlayerRepository.findPlayersByCounty.mockResolvedValue([mockPlayer]);

      const result = await playerService.getPlayersFromCounty(county);

      expect(result).toEqual(plainToInstance(FindPlayerResponseDTO, [mockPlayer]));
      expect(playerRepository.findPlayersByCounty).toHaveBeenCalledWith(county);
    });

    it('should return an empty array if no players from the county', async () => {
      const county = County.Galway;
      mockPlayerRepository.findPlayersByCounty.mockResolvedValue([]);

      const result = await playerService.getPlayersFromCounty(county);

      expect(result).toEqual([]);
      expect(playerRepository.findPlayersByCounty).toHaveBeenCalledWith(county);
    });
  });

  describe('getPlayersFromClub', () => {
    it('should return players from a club', async () => {
      const club = 'Carnmore';
      mockPlayerRepository.findPlayersByClub.mockResolvedValue([mockPlayer]);

      const result = await playerService.getPlayersFromClub(club);

      expect(result).toEqual(plainToInstance(FindPlayerResponseDTO, [mockPlayer]));
      expect(playerRepository.findPlayersByClub).toHaveBeenCalledWith(club);
    });

    it('should return an empty array if no players from the club', async () => {
      const club = 'Carnmore';
      mockPlayerRepository.findPlayersByClub.mockResolvedValue([]);

      const result = await playerService.getPlayersFromClub(club);

      expect(result).toEqual([]);
      expect(playerRepository.findPlayersByClub).toHaveBeenCalledWith(club);
    });
  });

  describe('updatePlayerPrice', () => {
    it('should update the player price', async () => {
      const updatePlayerPriceDto: UpdatePlayerPriceDto = {
        playerId: '12345',
        price: 10,
      };

      mockPlayerRepository.updatePlayerPrice.mockResolvedValue(mockPlayer);

      const result = await playerService.updatePlayerPrice(updatePlayerPriceDto);

      expect(result).toEqual(plainToInstance(FindPlayerResponseDTO, mockPlayer));
      expect(playerRepository.updatePlayerPrice).toHaveBeenCalledWith(
        updatePlayerPriceDto.playerId,
        updatePlayerPriceDto.price,
      );
    });
  });

  describe('updatePlayerStatus', () => {
    it('should update the player status', async () => {
      const updatePlayerStatusDto: UpdatePlayerStatusDto = {
        playerId: '12345',
        status: Status.INJURED,
      };

      mockPlayerRepository.updatePlayerStatus.mockResolvedValue(mockPlayer);

      const result = await playerService.updatePlayerStatus(updatePlayerStatusDto);

      expect(result).toEqual(plainToInstance(FindPlayerResponseDTO, mockPlayer));
      expect(playerRepository.updatePlayerStatus).toHaveBeenCalledWith(
        updatePlayerStatusDto.playerId,
        updatePlayerStatusDto.status,
      );
    });
  });
});
