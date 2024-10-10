import { Test, TestingModule } from '@nestjs/testing';
import { LeagueService } from './league.service';
import { LeagueRepository } from '../../../lib/league/repository/league.repository';
import { CreateLeagueDto } from '../dto/request/create-league.dto';
import { JoinLeagueDto } from '../dto/request/join-league.dto';
import { GetLeagueResponseDto } from '../dto/response/get-league-reponse.dto';
import { NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

describe('LeagueService', () => {
  let leagueService: LeagueService;
  let leagueRepository: LeagueRepository;

  const mockLeagueRepository = {
    createLeague: jest.fn(),
    findLeagueByCode: jest.fn(),
    joinLeague: jest.fn(),
    findLeague: jest.fn(),
    findTeamsInLeague: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeagueService,
        {
          provide: LeagueRepository,
          useValue: mockLeagueRepository,
        },
      ],
    }).compile();

    leagueService = module.get<LeagueService>(LeagueService);
    leagueRepository = module.get<LeagueRepository>(LeagueRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test case for createLeague
  describe('createLeague', () => {
    it('should create and return the new league', async () => {
      const createLeagueDto: CreateLeagueDto = {
        leagueName: 'Test League',
        admin: 'adminId',
        teams: ['team1', 'team2'],
      };

      const leagueResponse = { id: 'league123', ...createLeagueDto };

      mockLeagueRepository.createLeague.mockResolvedValue(leagueResponse);

      const result = await leagueService.createLeague(createLeagueDto);

      expect(mockLeagueRepository.createLeague).toHaveBeenCalledWith(createLeagueDto);
      expect(result).toEqual(leagueResponse);
    });
  });

  // Test case for joinLeague
  describe('joinLeague', () => {
    it('should join an existing league and return updated league', async () => {
      const joinLeagueDto: JoinLeagueDto = {
        leagueCode: 'league123',
        teamId: 'team1',
      };

      const league = { id: 'league123', leagueCode: 'league123', teams: ['team1'] };
      const updatedLeague = { ...league, teams: ['team1', 'team2'] };

      mockLeagueRepository.findLeagueByCode.mockResolvedValue(league);
      mockLeagueRepository.joinLeague.mockResolvedValue(updatedLeague);

      const result = await leagueService.joinLeague(joinLeagueDto);

      expect(mockLeagueRepository.findLeagueByCode).toHaveBeenCalledWith(joinLeagueDto.leagueCode);
      expect(mockLeagueRepository.joinLeague).toHaveBeenCalledWith(joinLeagueDto);
      expect(result).toEqual(plainToInstance(GetLeagueResponseDto, updatedLeague));
    });

    it('should throw NotFoundException if the league code is not found', async () => {
      const joinLeagueDto: JoinLeagueDto = {
        leagueCode: 'nonExistingLeagueCode',
        teamId: 'team1',
      };

      mockLeagueRepository.findLeagueByCode.mockResolvedValue(null);

      await expect(leagueService.joinLeague(joinLeagueDto)).rejects.toThrow(
        new NotFoundException(`League with code ${joinLeagueDto.leagueCode} does not exist`),
      );
      expect(mockLeagueRepository.findLeagueByCode).toHaveBeenCalledWith(joinLeagueDto.leagueCode);
    });
  });

  // Test case for getLeague
  describe('getLeague', () => {
    it('should return a league for a valid leagueId', async () => {
      const leagueId = 'league123';
      const league = { id: leagueId, leagueName: 'Test League', admin: 'adminId', teams: ['team1'] };

      mockLeagueRepository.findLeague.mockResolvedValue(league);

      const result = await leagueService.getLeague(leagueId);

      expect(mockLeagueRepository.findLeague).toHaveBeenCalledWith(leagueId);
      expect(result).toEqual(plainToInstance(GetLeagueResponseDto, league));
    });

    it('should throw NotFoundException if league is not found', async () => {
      const leagueId = 'nonExistingLeagueId';

      mockLeagueRepository.findLeague.mockResolvedValue(null);

      await expect(leagueService.getLeague(leagueId)).rejects.toThrow(
        new NotFoundException('League not found'),
      );
      expect(mockLeagueRepository.findLeague).toHaveBeenCalledWith(leagueId);
    });
  });

  // Test case for getTeamsInLeague
  describe('getTeamsInLeague', () => {
    it('should return a list of teams in the league', async () => {
      const leagueId = 'league123';
      const teams = [
        { id: 'team1', userId: 'user1', players: [], teamInfo: {}, budget: 100, totalPoints: 0, transfers: {} },
        { id: 'team2', userId: 'user2', players: [], teamInfo: {}, budget: 90, totalPoints: 10, transfers: {} },
      ];

      mockLeagueRepository.findTeamsInLeague.mockResolvedValue(teams);

      const result = await leagueService.getTeamsInLeague(leagueId);

      expect(mockLeagueRepository.findTeamsInLeague).toHaveBeenCalledWith(leagueId);
      expect(result).toEqual(teams);
    });

    it('should return an empty array if no teams are found in the league', async () => {
      const leagueId = 'league123';

      mockLeagueRepository.findTeamsInLeague.mockResolvedValue([]);

      const result = await leagueService.getTeamsInLeague(leagueId);

      expect(mockLeagueRepository.findTeamsInLeague).toHaveBeenCalledWith(leagueId);
      expect(result).toEqual([]);
    });
  });
});
