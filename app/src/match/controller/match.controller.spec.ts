import { Test, TestingModule } from '@nestjs/testing';
import { MatchController } from './match.controller';
import { MatchService } from '../service/match.service';
import { CreateMatchDto } from '../dto/create-match.dto';
import { UpdateMatchScoreDto } from '../dto/update-match-score.dto';
import { GetMatchResponseDto } from '../dto/get-match-response.dto';
import { PlayerPerformanceDto } from '../dto/player-performance.dto';
import { County } from '../../../lib/common/enum/counties';
import { RolesGuard } from '../../../src/auth/guards/roles.guard';
import { AuthGuard } from '../../../src/auth/guards/auth.guard';

describe('MatchController', () => {
  let matchController: MatchController;
  let matchService: MatchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchController],
      providers: [
        {
          provide: MatchService,
          useValue: {
            createMatch: jest.fn(),
            updateMatchScore: jest.fn(),
            getMatch: jest.fn(),
            getMatchPlayers: jest.fn(),
            updatePlayerPerformance: jest.fn(),
          },
        },
      ],
    }).overrideGuard(AuthGuard)
    .useValue({ canActivate: () => true }) // Mocking guard
    .overrideGuard(RolesGuard)
    .useValue({ canActivate: () => true }) // Mocking guard
    .compile();

    matchController = module.get<MatchController>(MatchController);
    matchService = module.get<MatchService>(MatchService);
  });

  describe('createMatch', () => {
    it('should call matchService.createMatch with the correct parameters', async () => {
      const createMatchDto: CreateMatchDto = {
        homeTeam: County.Antrim,
        awayTeam: County.Cork,
        playerPerformance: [],
        gameweek: 1
      };
      const expectedResult: GetMatchResponseDto = {
        homeTeam: County.Antrim,
        awayTeam: County.Cork,
        homeScore: '0-00',
        awayScore: '0-00',
        playerPerformance: [],
        id: '123',
        dateCreated: new Date(),
        gameweek: 1
      };
      jest.spyOn(matchService, 'createMatch').mockResolvedValue(expectedResult);

      const result = await matchController.createMatch(createMatchDto);
      expect(result).toBe(expectedResult);
      expect(matchService.createMatch).toHaveBeenCalledWith(createMatchDto);
    });
  });

  describe('updateMatchScore', () => {
    it('should call matchService.updateMatchScore with the correct parameters', async () => {
      const updateMatchScoreDto: UpdateMatchScoreDto = {
        matchId: '1',
        homeTeamScore: '2-10',
        awayTeamScore: '3-12',
      };
      const expectedResult: GetMatchResponseDto = {
        homeTeam: County.Antrim,
        awayTeam: County.Cork,
        homeScore: '2-10',
        awayScore: '3-12',
        playerPerformance: [],
        id: '123', 
        dateCreated: new Date(),
        gameweek: 1
      };
      jest.spyOn(matchService, 'updateMatchScore').mockResolvedValue(expectedResult);

      const result = await matchController.updateMatchScore(updateMatchScoreDto);
      expect(result).toBe(expectedResult);
      expect(matchService.updateMatchScore).toHaveBeenCalledWith(updateMatchScoreDto);
    });
  });

  describe('getMatch', () => {
    it('should return the match by ID', async () => {
      const matchId = '1';
      const expectedResult: GetMatchResponseDto = {
        homeTeam: County.Antrim,
        awayTeam: County.Cork,
        homeScore: '1-10',
        awayScore: '0-12',
        playerPerformance: [],
        id: '123', 
        dateCreated: new Date(),
        gameweek: 1
      };
      jest.spyOn(matchService, 'getMatch').mockResolvedValue(expectedResult);

      const result = await matchController.getMatch(matchId);
      expect(result).toBe(expectedResult);
      expect(matchService.getMatch).toHaveBeenCalledWith(matchId);
    });
  });

  describe('getMatchPlayers', () => {
    it('should return the players in a match', async () => {
      const matchId = '1';
      const expectedPlayers: PlayerPerformanceDto[] = [
        {
          playerId: 'playerId-1',
          goals: 2,
          points: 1,
          yellowCards: 0,
          redCards: 0,
          minutes: 90,
          saves: 0,
          penaltySaves: 0,
          hooks: 1,
          blocks: 0,
          totalPoints: 4,
        },
      ];
      jest.spyOn(matchService, 'getMatchPlayers').mockResolvedValue(expectedPlayers);

      const result = await matchController.getMatchPlayers(matchId);
      expect(result).toBe(expectedPlayers);
      expect(matchService.getMatchPlayers).toHaveBeenCalledWith(matchId);
    });
  });
});
