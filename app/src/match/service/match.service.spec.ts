import { Test, TestingModule } from '@nestjs/testing';
import { MatchService } from './match.service';
import { MatchRepository } from '../../../lib/match/repository/match.repository';
import { NotFoundException } from '@nestjs/common';
import { CreateMatchDto } from '../dto/create-match.dto';
import { UpdateMatchScoreDto } from '../dto/update-match-score.dto';
import { GetMatchResponseDto } from '../dto/get-match-response.dto';
import { PlayerPerformanceDto } from '../dto/player-performance.dto';
import { UpdatePlayerPerformanceDto } from '../dto/update-player-performance.dto';
import { Points } from '../../../lib/points/enum/points.enum';
import { plainToInstance } from 'class-transformer';
import { County } from '../../../lib/common/enum/counties';
import { PlayerRepository } from '../../../lib/player/repository/player.repository';
import { TeamRepository } from '../../../lib/team/repository/team.repository';

describe('MatchService', () => {
  let matchService: MatchService;
  let matchRepository: MatchRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchService,
        {
          provide: MatchRepository,
          useValue: {
            createMatch: jest.fn(),
            updateMatchScore: jest.fn(),
            findMatch: jest.fn(),
            findMatchPlayers: jest.fn(),
            updatePlayerPerformance: jest.fn(),
          },
        },
        {
          provide: PlayerRepository,
          useValue: {
            addTotalPoints: jest.fn(),
          },
        },
        {
          provide: TeamRepository,
          useValue: {
            addTotalPoints: jest.fn(),
          },
        },
      ],
    }).compile();

    matchService = module.get<MatchService>(MatchService);
    matchRepository = module.get<MatchRepository>(MatchRepository);
  });

  describe('createMatch', () => {
    it('should call matchRepository.createMatch and return the match', async () => {
      const createMatchDto: CreateMatchDto = {
        homeTeam: County.Antrim,
        awayTeam: County.Cork,
        playerPerformance: [
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
        ],
      };
      const mockMatch = { ...createMatchDto, homeScore: '0-00', awayScore: '0-00', id: '123', dateCreated: new Date() };
      jest.spyOn(matchRepository, 'createMatch').mockResolvedValue(mockMatch);

      const result = await matchService.createMatch(createMatchDto);
      expect(result).toEqual(plainToInstance(GetMatchResponseDto, mockMatch));
      expect(matchRepository.createMatch).toHaveBeenCalledWith(createMatchDto);
    });
  });

  describe('updateMatchScore', () => {
    it('should update the match score and return updated match', async () => {
      const updateMatchScoreDto: UpdateMatchScoreDto = {
        matchId: '1',
        homeTeamScore: '1-10',
        awayTeamScore: '0-12',
      };
      const mockUpdatedMatch = {
        matchId: '1',
        homeTeam: County.Antrim,
        awayTeam: County.Cork,
        homeScore: '1-10',
        awayScore: '0-12',
        playerPerformance: [],
        id: '123', 
        dateCreated: new Date()
      };
      jest.spyOn(matchRepository, 'updateMatchScore').mockResolvedValue(mockUpdatedMatch);

      const result = await matchService.updateMatchScore(updateMatchScoreDto);
      expect(result).toEqual(plainToInstance(GetMatchResponseDto, mockUpdatedMatch));
      expect(matchRepository.updateMatchScore).toHaveBeenCalledWith(
        updateMatchScoreDto.matchId,
        updateMatchScoreDto.homeTeamScore,
        updateMatchScoreDto.awayTeamScore
      );
    });
  });

  describe('getMatch', () => {
    it('should return the match if found', async () => {
      const mockMatch = { matchId: '1', homeTeam: County.Antrim, awayTeam: County.Cork, homeScore: '1-10', awayScore: '0-12', playerPerformance: [], id: '123', dateCreated: new Date() };
      jest.spyOn(matchRepository, 'findMatch').mockResolvedValue(mockMatch);

      const result = await matchService.getMatch('1');
      expect(result).toEqual(plainToInstance(GetMatchResponseDto, mockMatch));
      expect(matchRepository.findMatch).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if match not found', async () => {
      jest.spyOn(matchRepository, 'findMatch').mockResolvedValue(null);

      await expect(matchService.getMatch('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getMatchPlayers', () => {
    it('should return players if match found', async () => {
      const mockPlayers: PlayerPerformanceDto[] = [
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
      jest.spyOn(matchRepository, 'findMatchPlayers').mockResolvedValue(mockPlayers);

      const result = await matchService.getMatchPlayers('1');
      expect(result).toEqual(plainToInstance(PlayerPerformanceDto, mockPlayers));
      expect(matchRepository.findMatchPlayers).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if players not found', async () => {
      jest.spyOn(matchRepository, 'findMatchPlayers').mockResolvedValue(null);

      await expect(matchService.getMatchPlayers('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updatePlayerPerformance', () => {
    it('should update the player performance and return updated data', async () => {
      const updatePlayerPerformanceDto: UpdatePlayerPerformanceDto = {
        matchId: '1',
        playerPerformance: {
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
      };

      const mockMatch = {
        matchId: '1',
        homeTeam: County.Antrim,
        awayTeam: County.Cork,
        homeScore: '1-10',
        awayScore: '0-12',
        playerPerformance: [updatePlayerPerformanceDto.playerPerformance],
        id: '123',
        dateCreated: new Date() 
      };
      jest.spyOn(matchService, 'getMatch').mockResolvedValue(mockMatch);
      jest.spyOn(matchRepository, 'updatePlayerPerformance').mockResolvedValue(mockMatch);

      const result = await matchService.updatePlayerPerformance(updatePlayerPerformanceDto);
      expect(result).toEqual(plainToInstance(PlayerPerformanceDto, updatePlayerPerformanceDto.playerPerformance));
      expect(matchRepository.updatePlayerPerformance).toHaveBeenCalledWith(
        updatePlayerPerformanceDto.matchId,
        updatePlayerPerformanceDto.playerPerformance
      );
    });

    it('should throw NotFoundException if player not found in the match', async () => {
      const updatePlayerPerformanceDto: UpdatePlayerPerformanceDto = {
        matchId: '1',
        playerPerformance: {
          playerId: 'unknown-player',
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
      };

      const mockMatch = {
        matchId: '1',
        homeTeam: County.Antrim,
        awayTeam: County.Cork,
        homeScore: '1-10',
        awayScore: '0-12',
        playerPerformance: [],
        id: '123', 
        dateCreated: new Date()
      };
      jest.spyOn(matchService, 'getMatch').mockResolvedValue(mockMatch);

      await expect(matchService.updatePlayerPerformance(updatePlayerPerformanceDto)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('calculateTotalPoints', () => {
    it('should calculate the total points correctly', () => {
      const playerPerformance: PlayerPerformanceDto = {
        playerId: 'player-1',
        goals: 1,
        points: 3,
        yellowCards: 1,
        redCards: 0,
        minutes: 60,
        saves: 2,
        penaltySaves: 1,
        hooks: 1,
        blocks: 1,
        totalPoints: 0,
      };

      const result = matchService['calculateTotalPoints'](playerPerformance);
      const expectedPoints =
        1 * Points.GOAL +
        3 * Points.POINT +
        1 * Points.YELLOW_CARD +
        2 * Points.SAVES +
        1 * Points.PENALTY_SAVE +
        1 * Points.HOOK +
        1 * Points.BLOCK +
        Points.FULL_GAME_PLAYED;

      expect(result).toEqual(expectedPoints);
    });
  });
});
