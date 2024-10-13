import { Test, TestingModule } from '@nestjs/testing';
import { PlayerController } from './player.controller';
import { PlayerService } from '../service/player.service';
import { AdminAuthGuard } from '../../auth/guards/admin-auth.guard';
import { UserAuthGuard } from '../../auth/guards/user-auth.guard';
import { FindPlayerResponseDTO } from '../dto/response/get-player-response.dto';
import { CreatePlayerDto } from '../dto/request/add-player-request.dto';
import { UpdatePlayerStatusDto } from '../dto/request/update-player-status-request.dto';
import { County } from '../../../lib/common/enum/counties';
import { GAAClub } from '../../../lib/common/enum/club';
import { Position } from '../../../lib/common/enum/position';
import { Status } from '../../../lib/player/constants/status.enum';
import { UpdatePlayerPriceDto } from '../dto/request/update-player-price-request.dto copy';

describe('PlayerController', () => {
  let playerController: PlayerController;
  let playerService: PlayerService;

  const mockPlayerService = {
    createPlayer: jest.fn(),
    updatePlayerPrice: jest.fn(),
    updatePlayerStatus: jest.fn(),
    getAllPlayers: jest.fn(),
    getPlayer: jest.fn(),
    getPlayersFromCounty: jest.fn(),
    getPlayersFromClub: jest.fn(),
  };

  const mockPlayerResponse: FindPlayerResponseDTO = {
    playerName: 'John Doe',
    profilePictureUrl: 'www.picurl.com',
    county: County.Galway,
    club: GAAClub.Carnmore,
    position: Position.FORWARD,
    price: 8.5,
    status: Status.AVAILABLE,
    id: '12345',
    dateCreated: new Date(),
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
      .useValue({ canActivate: () => true }) // Mocking guard
      .overrideGuard(UserAuthGuard)
      .useValue({ canActivate: () => true }) // Mocking guard
      .compile();

    playerController = module.get<PlayerController>(PlayerController);
    playerService = module.get<PlayerService>(PlayerService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe('addPlayer', () => {
    it('should create a player and return it', async () => {
      const createPlayerDto: CreatePlayerDto = {
        playerName: 'John Doe',
        profilePictureUrl: 'www.picurl.com',
        county: County.Galway,
        club: GAAClub.Carnmore,
        position: Position.FORWARD,
        price: 8.5,
        status: Status.AVAILABLE,
      };

      mockPlayerService.createPlayer.mockResolvedValue(mockPlayerResponse);

      const result = await playerController.addPlayer(createPlayerDto);

      expect(result).toEqual(mockPlayerResponse);
      expect(playerService.createPlayer).toHaveBeenCalledWith(createPlayerDto);
    });
  });

  describe('updatePlayerPrice', () => {
    it('should update the player price', async () => {
      const updatePlayerPriceDto: UpdatePlayerPriceDto = {
        playerId: '12345',
        price: 9.0,
      };

      mockPlayerService.updatePlayerPrice.mockResolvedValue(mockPlayerResponse);

      const result = await playerController.updatePlayerPrice(updatePlayerPriceDto);

      expect(result).toEqual(mockPlayerResponse);
      expect(playerService.updatePlayerPrice).toHaveBeenCalledWith(updatePlayerPriceDto);
    });
  });

  describe('updatePlayerStatus', () => {
    it('should update the player status', async () => {
      const updatePlayerStatusDto: UpdatePlayerStatusDto = {
        playerId: '12345',
        status: Status.INJURED,
      };

      mockPlayerService.updatePlayerStatus.mockResolvedValue(mockPlayerResponse);

      const result = await playerController.updatePlayerStats(updatePlayerStatusDto);

      expect(result).toEqual(mockPlayerResponse);
      expect(playerService.updatePlayerStatus).toHaveBeenCalledWith(updatePlayerStatusDto);
    });
  });

  describe('getAllPlayers', () => {
    it('should return an array of players', async () => {
      mockPlayerService.getAllPlayers.mockResolvedValue([mockPlayerResponse]);

      const result = await playerController.getAllPlayers();

      expect(result).toEqual([mockPlayerResponse]);
      expect(playerService.getAllPlayers).toHaveBeenCalled();
    });
  });

  describe('getPlayer', () => {
    it('should return a player by ID', async () => {
      const playerId = '12345';
      mockPlayerService.getPlayer.mockResolvedValue(mockPlayerResponse);

      const result = await playerController.getPlayer(playerId);

      expect(result).toEqual(mockPlayerResponse);
      expect(playerService.getPlayer).toHaveBeenCalledWith(playerId);
    });
  });

  describe('getPlayersByCounty', () => {
    it('should return players from a county', async () => {
      const countyName = County.Galway;
      mockPlayerService.getPlayersFromCounty.mockResolvedValue([mockPlayerResponse]);

      const result = await playerController.getPlayersByCounty(countyName);

      expect(result).toEqual([mockPlayerResponse]);
      expect(playerService.getPlayersFromCounty).toHaveBeenCalledWith(countyName);
    });
  });

  describe('getPlayersByClub', () => {
    it('should return players from a club', async () => {
      const clubName = GAAClub.Carnmore;
      mockPlayerService.getPlayersFromClub.mockResolvedValue([mockPlayerResponse]);

      const result = await playerController.getPlayersByClub(clubName);

      expect(result).toEqual([mockPlayerResponse]);
      expect(playerService.getPlayersFromClub).toHaveBeenCalledWith(clubName);
    });
  });
});
