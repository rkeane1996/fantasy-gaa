import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerRepository } from '../repository/player.repository';
import { PlayerDTO } from '../dto/request/add-player-request.dto';
import { County } from '../../../lib/common/enum/counties';
import { FindPlayerResponseDTO } from '../dto/response/get-player-response.dto';
import { CreatePlayerResponseDto } from '../dto/response/create-player-response.dto';
import { Player } from '../schema/player.schema';
import { GAAClub } from '../../../lib/common/enum/club';
import { Position } from '../enums/position';

describe('PlayerService', () => {
  let service: PlayerService;
  let playerRepo: PlayerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerService,
        {
          provide: PlayerRepository,
          useValue: {
            createPlayer: jest.fn(),
            findAllPlayers: jest.fn(),
            findPlayer: jest.fn(),
            findPlayersByCounty: jest.fn(),
            findPlayersByClub: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PlayerService>(PlayerService);
    playerRepo = module.get<PlayerRepository>(PlayerRepository);
  });

  describe('addPlayer', () => {
    it('should add a player and return its id', async () => {
      const playerDto: PlayerDTO = {
        playerName: 'John Doe',
        position: Position.FORWARD,
        club: {
          clubName: GAAClub.Carnmore,
          county: County.Dublin,
        },
        county: County.Cork,
      };
      const player = {
        playerId: '123',
        playerName: playerDto.playerName,
        position: playerDto.position,
        club: playerDto.club,
      };
      jest.spyOn(playerRepo, 'createPlayer').mockResolvedValue(player);

      const result = await service.addPlayer(playerDto);
      expect(result).toEqual(
        new CreatePlayerResponseDto({ id: player.playerId }),
      );
      expect(playerRepo.createPlayer).toHaveBeenCalledWith(playerDto);
    });
  });

  describe('findAllPlayers', () => {
    it('should return an array of players', async () => {
      const players: Player[] = [
        {
          playerId: '123',
          playerName: 'John Doe',
          position: Position.FORWARD,
          club: {
            clubName: GAAClub.Carnmore,
            county: County.Dublin,
          },
          county: County.Dublin
        },
      ];
      jest.spyOn(playerRepo, 'findAllPlayers').mockResolvedValue(players);

      const result = await service.findAllPlayers();
      expect(result).toEqual(
        players.map((player) => service.createResponseDto(player)),
      );
      expect(playerRepo.findAllPlayers).toHaveBeenCalled();
    });

    it('should return an empty array if no players are found', async () => {
      jest.spyOn(playerRepo, 'findAllPlayers').mockResolvedValue([]);

      const result = await service.findAllPlayers();
      expect(result).toEqual([]);
      expect(playerRepo.findAllPlayers).toHaveBeenCalled();
    });
  });

  describe('getPlayer', () => {
    it('should return a player by id', async () => {
      const player: Player = {
        playerId: '123',
        playerName: 'John Doe',
        position: Position.FORWARD,
        club: {
          clubName: GAAClub.Carnmore,
          county: County.Dublin,
        },
        county: County.Dublin
      };
      jest.spyOn(playerRepo, 'findPlayer').mockResolvedValue(player);

      const result = await service.getPlayer('123');
      expect(result).toEqual(service.createResponseDto(player));
      expect(playerRepo.findPlayer).toHaveBeenCalledWith('123');
    });

    it('should throw a NotFoundException if the player is not found', async () => {
      jest.spyOn(playerRepo, 'findPlayer').mockResolvedValue(null);

      await expect(service.getPlayer('123')).rejects.toThrow(NotFoundException);
      expect(playerRepo.findPlayer).toHaveBeenCalledWith('123');
    });
  });

  describe('getPlayersFromCounty', () => {
    it('should return an array of players from a county', async () => {
      const players: Player[] = [
        {
          playerId: '123',
          playerName: 'John Doe',
          position: Position.FORWARD,
          club: {
            clubName: GAAClub.Carnmore,
            county: County.Dublin,
          },
          county: County.Dublin
        },
      ];
      jest.spyOn(playerRepo, 'findPlayersByCounty').mockResolvedValue(players);

      const result = await service.getPlayersFromCounty(County.Dublin);
      expect(result).toEqual(
        players.map((player) => service.createResponseDto(player)),
      );
      expect(playerRepo.findPlayersByCounty).toHaveBeenCalledWith(
        County.Dublin,
      );
    });

    it('should return an empty array if no players are found in the county', async () => {
      jest.spyOn(playerRepo, 'findPlayersByCounty').mockResolvedValue([]);

      const result = await service.getPlayersFromCounty(County.Dublin);
      expect(result).toEqual([]);
      expect(playerRepo.findPlayersByCounty).toHaveBeenCalledWith(
        County.Dublin,
      );
    });
  });

  describe('getPlayersFromClub', () => {
    it('should return an array of players from a club', async () => {
      const players: Player[] = [
        {
          playerId: '123',
          playerName: 'John Doe',
          position: Position.FORWARD,
          club: {
            clubName: GAAClub.Carnmore,
            county: County.Dublin,
          },
          county: County.Dublin
        },
      ];
      jest.spyOn(playerRepo, 'findPlayersByClub').mockResolvedValue(players);

      const result = await service.getPlayersFromClub('FC Awesome');
      expect(result).toEqual(
        players.map((player) => service.createResponseDto(player)),
      );
      expect(playerRepo.findPlayersByClub).toHaveBeenCalledWith('FC Awesome');
    });

    it('should return an empty array if no players are found in the club', async () => {
      jest.spyOn(playerRepo, 'findPlayersByClub').mockResolvedValue([]);

      const result = await service.getPlayersFromClub('FC Awesome');
      expect(result).toEqual([]);
      expect(playerRepo.findPlayersByClub).toHaveBeenCalledWith('FC Awesome');
    });
  });

  describe('createResponseDto', () => {
    it('should create a FindPlayerResponseDTO from a Player', () => {
      const player: Player = {
        playerId: '123',
        playerName: 'John Doe',
        position: Position.FORWARD,
        club: {
          clubName: GAAClub.Carnmore,
          county: County.Dublin,
        },
        county: County.Dublin
      };

      const result = service.createResponseDto(player);
      const expected = new FindPlayerResponseDTO();
      expected.playerId = '123';
      expected.playerName = 'John Doe';
      expected.position = Position.FORWARD;
      expected.club = {
        clubName: GAAClub.Carnmore,
        county: County.Dublin,
      };
      expected.county = County.Dublin;

      expect(result).toEqual(expected);
    });
  });
});
