import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { GameweekService } from './gameweek.service';
import { GameweekRepository } from '../repository/gameweek.repository';
import { MatchRepository } from '../repository/match.repository';
import { CreateGameweekDto } from '../dto/request/create-gameweek.dto';
import { CreateMatchDto } from '../dto/request/create-match.dto';
import { Gameweek } from '../schema/gameweek.schema';
import { Match } from '../schema/match.schema';
import { Points } from '../../../src/points/types/points.type';
import { County } from '../../../lib/common/enum/counties';

describe('GameweekService', () => {
  let service: GameweekService;
  let gameweekRepo: GameweekRepository;
  let matchRepo: MatchRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameweekService,
        {
          provide: GameweekRepository,
          useValue: {
            getGameWeek: jest.fn(),
            createGameWeek: jest.fn(),
            getGameWeeks: jest.fn(),
            startEndGameweek: jest.fn(),
            addMatchToGameweek: jest.fn(),
          },
        },
        {
          provide: MatchRepository,
          useValue: {
            addMatch: jest.fn(),
            getGameweekMatches: jest.fn(),
            updateMatchScore: jest.fn(),
            updatePlayerPoints: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GameweekService>(GameweekService);
    gameweekRepo = module.get<GameweekRepository>(GameweekRepository);
    matchRepo = module.get<MatchRepository>(MatchRepository);
  });

  // Test for creating a new gameweek
  describe('createGameWeek', () => {
    const createGameweekDto: CreateGameweekDto = {
      gameweekNumber: 1,
      matches: [],
      transferDeadline: new Date(),
    };

    it('should create a new gameweek if it does not exist', async () => {
      jest.spyOn(gameweekRepo, 'getGameWeek').mockResolvedValue(null);
      jest.spyOn(gameweekRepo, 'createGameWeek').mockResolvedValue({
        _id: '1',
        gameweekNumber: 1,
        transferDeadline: new Date(),
      } as Gameweek);

      const result = await service.createGameWeek(createGameweekDto);
      expect(gameweekRepo.getGameWeek).toHaveBeenCalledWith(1);
      expect(gameweekRepo.createGameWeek).toHaveBeenCalledWith(
        createGameweekDto,
      );
      expect(result.gameweekNumber).toEqual(1);
    });

    it('should return an existing gameweek if already created', async () => {
      const existingGameweek = { _id: '1', gameweekNumber: 1 } as Gameweek;
      jest
        .spyOn(gameweekRepo, 'getGameWeek')
        .mockResolvedValue(existingGameweek);

      const result = await service.createGameWeek(createGameweekDto);
      expect(gameweekRepo.getGameWeek).toHaveBeenCalledWith(1);
      expect(result.gameweekNumber).toEqual(1);
    });

    it('should throw BadRequestException if gameweek creation fails', async () => {
      jest.spyOn(gameweekRepo, 'getGameWeek').mockResolvedValue(null);
      jest.spyOn(gameweekRepo, 'createGameWeek').mockResolvedValue(null);

      await expect(service.createGameWeek(createGameweekDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  // Test for fetching all gameweeks
  describe('getGameWeeks', () => {
    it('should return all gameweeks', async () => {
      const gameweeks = [
        { _id: '1', gameweekNumber: 1, matches: [] },
        { _id: '2', gameweekNumber: 2, matches: [] },
      ] as Gameweek[];

      jest.spyOn(gameweekRepo, 'getGameWeeks').mockResolvedValue(gameweeks);

      const result = await service.getGameWeeks();
      expect(gameweekRepo.getGameWeeks).toHaveBeenCalled();
      expect(result.length).toBe(2);
    });
  });

  // Test for fetching a specific gameweek by its number
  describe('getGameWeek', () => {
    it('should return a gameweek by its number', async () => {
      const gameweek = { _id: '1', gameweekNumber: 1, matches: [] } as Gameweek;
      jest.spyOn(gameweekRepo, 'getGameWeek').mockResolvedValue(gameweek);

      const result = await service.getGameWeek(1);
      expect(gameweekRepo.getGameWeek).toHaveBeenCalledWith(1);
      expect(result.gameweekNumber).toEqual(1);
    });

    it('should throw NotFoundException if gameweek is not found', async () => {
      jest.spyOn(gameweekRepo, 'getGameWeek').mockResolvedValue(null);

      await expect(service.getGameWeek(1)).rejects.toThrow(NotFoundException);
    });
  });

  // Test for activating or deactivating a gameweek
  describe('startEndGameweek', () => {
    it('should start or end a gameweek', async () => {
      const gameweek = { gameweekNumber: 1, isActive: true } as Gameweek;
      jest.spyOn(gameweekRepo, 'startEndGameweek').mockResolvedValue(gameweek);

      const result = await service.startEndGameweek(1, true);
      expect(gameweekRepo.startEndGameweek).toHaveBeenCalledWith(1, true);
      expect(result.Gameweek).toEqual(1);
      expect(result.IsActive).toBe(true);
    });
  });

  // Test for adding matches to a gameweek
  describe('addMatchToGameweek', () => {
    const matches: CreateMatchDto[] = [
      {
        homeTeam: County.Antrim,
        awayTeam: County.Dublin,
        players: [{ playerId: 'player1', points: [] }],
        gameweek: 1,
      },
    ];

    it('should add matches to a gameweek', async () => {
      const match = {
        id: 'match1',
        homeTeam: County.Antrim,
        awayTeam: County.Dublin,
        players: [],
        gameweek: 1,
      } as unknown as Match;

      jest.spyOn(matchRepo, 'addMatch').mockResolvedValue(match);
      jest.spyOn(gameweekRepo, 'addMatchToGameweek').mockResolvedValue(null);

      const result = await service.addMatchToGameweek(matches);
      expect(matchRepo.addMatch).toHaveBeenCalledWith(matches[0]);
      expect(gameweekRepo.addMatchToGameweek).toHaveBeenCalledWith('match1', 1);
      expect(result[0].homeTeam).toEqual(County.Antrim);
    });
  });

  // Test for fetching gameweek matches
  describe('getGameweekMatches', () => {
    it('should return all matches for a given gameweek', async () => {
      const matches = [
        { id: 'match1', homeTeam: County.Antrim, awayTeam: County.Dublin },
        { id: 'match2', homeTeam: County.Clare, awayTeam: County.Galway },
      ] as unknown as Match[];

      jest.spyOn(matchRepo, 'getGameweekMatches').mockResolvedValue(matches);

      const result = await service.getGameweekMatches(1);
      expect(matchRepo.getGameweekMatches).toHaveBeenCalledWith(1);
      expect(result.length).toBe(2);
    });
  });

  // Test for updating match score
  describe('updateMatchScore', () => {
    it('should update the score of a match', async () => {
      const match = {
        id: 'match1',
        homeTeam: County.Antrim,
        awayTeam: County.Dublin,
        homeScore: '1-10',
        awayScore: '0-12',
        players: [],
        gameweek: 1,
      } as unknown as Match;

      jest.spyOn(matchRepo, 'updateMatchScore').mockResolvedValue(match);

      const result = await service.updateMatchScore('match1', '1-10', '0-12');
      expect(matchRepo.updateMatchScore).toHaveBeenCalledWith(
        'match1',
        '1-10',
        '0-12',
      );
      expect(result.homeScore).toEqual('1-10');
      expect(result.awayScore).toEqual('0-12');
    });
  });

  // Test for updating player points in a match
  describe('updatePlayerPointsScoredInMatch', () => {
    const points: Points[] = [{ pointType: 'SCORED_POINT', pointValue: 1 }];

    it('should update player points in a match', async () => {
      const match = {
        id: 'match1',
        homeTeam: County.Antrim,
        awayTeam: County.Dublin,
        players: [{ playerId: 'player1', points }],
        gameweek: 1,
      } as unknown as Match;

      jest.spyOn(matchRepo, 'updatePlayerPoints').mockResolvedValue(match);

      const result = await service.updatePlayerPointsScoredInMatch(
        'match1',
        'player1',
        points,
      );
      expect(matchRepo.updatePlayerPoints).toHaveBeenCalledWith(
        'match1',
        'player1',
        points,
      );
      expect(result.players[0].points[0].pointType).toEqual('SCORED_POINT');
    });
  });
});
