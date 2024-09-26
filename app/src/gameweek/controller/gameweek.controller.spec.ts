import { Test, TestingModule } from '@nestjs/testing';
import { GameweekController } from './gameweek.controller';
import { GameweekService } from '../service/gameweek.service';
import { CreateGameweekDto } from '../dto/request/create-gameweek.dto';
import { StartStopGameweekDto } from '../dto/request/start-end-gameweek.dto';
import { GetGameweekQueryDto } from '../dto/request/get-gameweek-query.dto';
import { UpdateMatchScoreDto } from '../dto/request/update-match-score.dto';
import { CreateMatchDto } from '../dto/request/create-match.dto';
import { GameweekActiveResposneDto } from '../dto/response/gameweek-active-response.dto';
import { GetGameweekResponseDto } from '../dto/response/get-gameweek-repsonse.dto';
import { GetMatchResponseDto } from '../dto/response/get-match-response.dto';
import { County } from '../../../lib/common/enum/counties';
import { AdminAuthGuard } from '../../../src/auth/guards/admin-auth.guard';

describe('GameweekController', () => {
  let controller: GameweekController;
  let gameweekService: GameweekService;

  const mockGameweekService = {
    createGameWeek: jest.fn(),
    getGameWeeks: jest.fn(),
    startEndGameweek: jest.fn(),
    getGameWeek: jest.fn(),
    addMatchToGameweek: jest.fn(),
    getGameweekMatches: jest.fn(),
    updateMatchScore: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameweekController],
      providers: [
        {
          provide: GameweekService,
          useValue: mockGameweekService,
        },
      ],
    })
      .overrideGuard(AdminAuthGuard)
      .useValue(jest.fn(() => true))
      .compile();

    controller = module.get<GameweekController>(GameweekController);
    gameweekService = module.get<GameweekService>(GameweekService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createGameWeek', () => {
    it('should create a gameweek successfully', async () => {
      const createGameweekDto: CreateGameweekDto = {
        gameweekNumber: 1,
        matches: ['match1'],
        transferDeadline: new Date(),
      };
      const gameweekResponse: GetGameweekResponseDto = {
        gameweekNumber: 1,
        matches: ['match1'],
        transferDeadline: new Date(),
        isActive: true,
      };

      mockGameweekService.createGameWeek.mockResolvedValue(gameweekResponse);

      const result = await controller.createGameWeek(createGameweekDto);

      expect(result).toEqual(gameweekResponse);
      expect(gameweekService.createGameWeek).toHaveBeenCalledWith(
        createGameweekDto,
      );
    });
  });

  describe('getGameWeeks', () => {
    it('should return an array of gameweeks', async () => {
      const gameweeksResponse: GetGameweekResponseDto[] = [
        {
          gameweekNumber: 1,
          matches: ['match1'],
          transferDeadline: new Date(),
          isActive: true,
        },
      ];

      mockGameweekService.getGameWeeks.mockResolvedValue(gameweeksResponse);

      const result = await controller.getGameWeeks();

      expect(result).toEqual(gameweeksResponse);
      expect(gameweekService.getGameWeeks).toHaveBeenCalled();
    });
  });

  describe('startEndGameweek', () => {
    it('should activate or deactivate a gameweek', async () => {
      const startStopDto: StartStopGameweekDto = {
        gameweekNumber: 1,
        isActive: true,
      };
      const gameweekActiveResponse: GameweekActiveResposneDto = {
        Gameweek: 1,
        IsActive: true,
      };

      mockGameweekService.startEndGameweek.mockResolvedValue(
        gameweekActiveResponse,
      );

      const result = await controller.startEndGameweek(startStopDto);

      expect(result).toEqual(gameweekActiveResponse);
      expect(gameweekService.startEndGameweek).toHaveBeenCalledWith(1, true);
    });
  });

  describe('getGameWeek', () => {
    it('should return a single gameweek', async () => {
      const queryDto: GetGameweekQueryDto = { gameweekNumber: 1 };
      const gameweekResponse: GetGameweekResponseDto = {
        gameweekNumber: 1,
        matches: ['match1'],
        transferDeadline: new Date(),
        isActive: true,
      };

      mockGameweekService.getGameWeek.mockResolvedValue(gameweekResponse);

      const result = await controller.getGameWeek(queryDto.gameweekNumber);

      expect(result).toEqual(gameweekResponse);
      expect(gameweekService.getGameWeek).toHaveBeenCalledWith(1);
    });
  });

  describe('addMatchToGameweek', () => {
    it('should add matches to a gameweek', async () => {
      const createMatchDto: CreateMatchDto[] = [
        {
          homeTeam: County.Antrim,
          awayTeam: County.Dublin,
          players: [
            {
              playerId: 'player1',
              points: [{ pointType: 'SCORED_POINT', pointValue: 1 }],
            },
          ],
          gameweek: 1,
        },
      ];
      const matchResponse: GetMatchResponseDto[] = [
        {
          matchId: 'match1',
          homeTeam: County.Antrim,
          awayTeam: County.Dublin,
          players: [
            {
              playerId: 'player1',
              points: [{ pointType: 'SCORED_POINT', pointValue: 1 }],
            },
          ],
          gameweek: 1,
          homeScore: '0-00',
          awayScore: '0-00',
        },
      ];

      mockGameweekService.addMatchToGameweek.mockResolvedValue(matchResponse);

      const result = await controller.addMatchToGameweek(createMatchDto);

      expect(result).toEqual(matchResponse);
      expect(gameweekService.addMatchToGameweek).toHaveBeenCalledWith(
        createMatchDto,
      );
    });
  });

  describe('getGameweekMatches', () => {
    it('should return matches for a gameweek', async () => {
      const matches = ['match1', 'match2'];

      mockGameweekService.getGameweekMatches.mockResolvedValue(matches);

      const result = await controller.getGameweekMatches(1);

      expect(result).toEqual(matches);
      expect(gameweekService.getGameweekMatches).toHaveBeenCalledWith(1);
    });
  });

  describe('updateMatchScore', () => {
    it('should update match score', async () => {
      const updateScoreDto: UpdateMatchScoreDto = {
        matchId: 'match1',
        homeTeamScore: '0-1',
        awayTeamScore: '2-1',
      };
      const matchResponse: GetMatchResponseDto = {
        matchId: 'match1',
        homeTeam: County.Antrim,
        awayTeam: County.Dublin,
        players: [
          {
            playerId: 'player1',
            points: [{ pointType: 'SCORED_POINT', pointValue: 1 }],
          },
        ],
        gameweek: 1,
        homeScore: '0-00',
        awayScore: '0-00',
      };

      mockGameweekService.updateMatchScore.mockResolvedValue(matchResponse);

      const result = await controller.updateMatchScore(updateScoreDto);

      expect(result).toEqual(matchResponse);
      expect(gameweekService.updateMatchScore).toHaveBeenCalledWith(
        'match1',
        '0-1',
        '2-1',
      );
    });
  });
});
