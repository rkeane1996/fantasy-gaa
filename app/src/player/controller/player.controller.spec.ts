import { Test, TestingModule } from '@nestjs/testing';
import { PlayerController } from './player.controller';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/service/user.service';
import { PlayerService } from '../service/player.service';
import { UserAuthGuard } from '../../auth/guards/user-auth.guard';
import { AdminAuthGuard } from '../../auth/guards/admin-auth.guard';
import { PlayerDTO } from '../dto/request/add-player-request.dto';
import { GAAClub } from '../../../lib/common/enum/club';
import { County } from '../../../lib/common/enum/counties';
import { Position } from '../enums/position';
import { CreatePlayerResponseDto } from '../dto/response/create-player-response.dto';
import { FindPlayerResponseDTO } from '../dto/response/get-player-response.dto';

describe('PlayerController', () => {
  let controller: PlayerController;
  let service: PlayerService;
  let playersFound: FindPlayerResponseDTO[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerController],
      providers: [
        {
          provide: PlayerService,
          useValue: {
            addPlayer: jest.fn(),
            findAllPlayers: jest.fn(),
            getPlayer: jest.fn(),
            getPlayersFromCounty: jest.fn(),
            getPlayersFromClub: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            getUserRole: jest.fn(() => true),
          },
        },
        {
          provide: UserAuthGuard, // Provide the UserAuthGuard
          useValue: {
            canActivate: jest.fn(() => true),
          }, // Use the mock class instead
        },
        {
          provide: AdminAuthGuard, // Provide the UserAuthGuard
          useValue: {
            canActivate: jest.fn(() => true),
          }, // Use the mock class instead
        },
      ],
    }) // Mocking the guard to always allow access
      .compile();

    controller = module.get<PlayerController>(PlayerController);
    service = module.get<PlayerService>(PlayerService);
    playersFound = [
      {
        playerId: '213e3f-43tg45g-gvre',
        playerName: 'test1',
        county: County.Galway,
        position: Position.FORWARD,
        club: {
          clubName: GAAClub.Carnmore,
          county: County.Galway,
        },
      },
      {
        playerId: '123-vfe-5vre',
        playerName: 'test2',
        county: County.Galway,
        position: Position.FORWARD,
        club: {
          clubName: GAAClub.Carnmore,
          county: County.Galway,
        },
      },
    ];
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('player/add', () => {
    it('should create a player', async () => {
      const player: PlayerDTO = {
        playerName: 'test',
        club: {
          clubName: GAAClub.Carnmore,
          county: County.Galway,
        },
        position: Position.FORWARD,
        county: County.Galway,
      };

      const createPlayerResponseDto: CreatePlayerResponseDto = {
        id: '123-abc-456',
      };

      jest
        .spyOn(service, 'addPlayer')
        .mockResolvedValue(createPlayerResponseDto);

      const result = await controller.addPlayer(player);
      expect(result).toEqual(createPlayerResponseDto);
      expect(service.addPlayer).toHaveBeenCalledWith(player);
    });
  });

  describe('player/', () => {
    it('should retrieve all players', async () => {
      jest.spyOn(service, 'findAllPlayers').mockResolvedValue(playersFound);

      const result = await controller.getAllPlayers();
      expect(result).toEqual(playersFound);
      expect(service.findAllPlayers).toHaveBeenCalled();
    });
  });

  describe('player/playerid', () => {
    it('should retrieve a player', async () => {
      jest.spyOn(service, 'getPlayer').mockResolvedValue(playersFound[0]);

      const result = await controller.getPlayer('213e3f-43tg45g-gvre');
      expect(result).toEqual(playersFound[0]);
      expect(service.getPlayer).toHaveBeenCalledWith('213e3f-43tg45g-gvre');
    });
  });

  describe('player/club', () => {
    it('should retrieve players by club', async () => {
      jest.spyOn(service, 'getPlayersFromClub').mockResolvedValue(playersFound);

      const result = await controller.getPlayersByClub(GAAClub.Carnmore);
      expect(result).toEqual(playersFound);
      expect(service.getPlayersFromClub).toHaveBeenCalledWith(GAAClub.Carnmore);
    });
  });

  describe('player/county', () => {
    it('should retrieve players by county', async () => {
      jest
        .spyOn(service, 'getPlayersFromCounty')
        .mockResolvedValue(playersFound);

      const result = await controller.getPlayersByCounty(County.Cork);
      expect(result).toEqual(playersFound);
      expect(service.getPlayersFromCounty).toHaveBeenCalledWith(County.Cork);
    });
  });
});
