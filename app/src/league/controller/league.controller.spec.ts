import { Test, TestingModule } from '@nestjs/testing';
import { LeagueController } from './league.controller';
import { LeagueService } from '../service/league.service';
import { CreateLeagueDto } from '../dto/request/create-league.dto';
import { JoinLeagueDto } from '../dto/request/join-league.dto';
import { GetLeagueResponseDto } from '../dto/response/get-league-reponse.dto';
import { Team } from '../../../lib/team/schema/team.schema';
import { ExecutionContext, NotFoundException } from '@nestjs/common';
import { UserAuthGuard } from '../../../src/auth/guards/user-auth.guard';

describe('LeagueController', () => {
  let leagueController: LeagueController;
  let leagueService: LeagueService;

  const mockLeagueService = {
    createLeague: jest.fn(),
    joinLeague: jest.fn(),
    getLeague: jest.fn(),
    getTeamsInLeague: jest.fn(),
  };

  const mockUserAuthGuard = {
    canActivate: jest.fn((context: ExecutionContext) => true), // Always allow access
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeagueController],
      providers: [
        {
          provide: LeagueService,
          useValue: mockLeagueService,
        },
      ],
    }).overrideGuard(UserAuthGuard)
    .useValue(mockUserAuthGuard)
    .compile();

    leagueController = module.get<LeagueController>(LeagueController);
    leagueService = module.get<LeagueService>(LeagueService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createLeague', () => {
    it('should call LeagueService.createLeague and return the result', async () => {
      const createLeagueDto: CreateLeagueDto = {
        leagueName: 'Test League',
        admin: 'adminId123',
        teams: ['team1', 'team2'],
      };

      const leagueResponse: GetLeagueResponseDto = {
        id: 'league123',
        leagueName: 'Test League',
        admin: 'adminId123',
        leagueCode: 'code123',
        teams: ['team1', 'team2'],
      };

      mockLeagueService.createLeague.mockResolvedValue(leagueResponse);

      const result = await leagueController.createLeague(createLeagueDto);

      expect(mockLeagueService.createLeague).toHaveBeenCalledWith(createLeagueDto);
      expect(result).toEqual(leagueResponse);
    });
  });

  describe('joinLeague', () => {
    it('should call LeagueService.joinLeague with JoinLeagueDto and return result', async () => {
      const joinLeagueDto: JoinLeagueDto = {
        leagueCode: 'league123',
        teamId: 'team123',
      };

      mockLeagueService.joinLeague.mockResolvedValue({});

      const result = await leagueController.joinLeague(joinLeagueDto);

      expect(mockLeagueService.joinLeague).toHaveBeenCalledWith(joinLeagueDto);
      expect(result).toEqual({});
    });
  });

  describe('getLeague', () => {
    it('should return the league for the given leagueId', async () => {
      const leagueResponse: GetLeagueResponseDto = {
        id: 'league123',
        leagueName: 'Test League',
        admin: 'adminId123',
        leagueCode: 'code123',
        teams: ['team1', 'team2'],
      };

      mockLeagueService.getLeague.mockResolvedValue(leagueResponse);

      const result = await leagueController.getLeague('league123');

      expect(mockLeagueService.getLeague).toHaveBeenCalledWith('league123');
      expect(result).toEqual(leagueResponse);
    });

    it('should throw NotFoundException when league is not found', async () => {
      mockLeagueService.getLeague.mockRejectedValue(new NotFoundException('League not found'));

      await expect(leagueController.getLeague('invalidLeagueId')).rejects.toThrow(NotFoundException);
      expect(mockLeagueService.getLeague).toHaveBeenCalledWith('invalidLeagueId');
    });
  });

  describe('getTeamsInLeague', () => {
    it('should return an array of teams in the league', async () => {
      const mockTeams: Team[] = [
        {
          id: 'team1', userId: 'user1', players: [], teamInfo: {
            teamName: 'test',
            jerseyColour: 'white',
            shortsColour: 'white'
          }, budget: 100, totalPoints: 0, transfers: {
            cost: 0,
            limit: 0,
            made: 0,
            freeTransfers: 0
          },
          dateCreated: new Date()
        },
        {
          id: 'team2', userId: 'user2', players: [], teamInfo: {
            teamName: 'test2',
            jerseyColour: 'blue',
            shortsColour: 'blue'
          }, budget: 90, totalPoints: 10, transfers: {
            cost: 0,
            limit: 0,
            made: 0,
            freeTransfers: 0
          },
          dateCreated: new Date()
        },
      ];

      mockLeagueService.getTeamsInLeague.mockResolvedValue(mockTeams);

      const result = await leagueController.getTeamsInLeague('league123');

      expect(mockLeagueService.getTeamsInLeague).toHaveBeenCalledWith('league123');
      expect(result).toEqual(mockTeams);
    });

    it('should throw NotFoundException if league has no teams', async () => {
      mockLeagueService.getTeamsInLeague.mockRejectedValue(new NotFoundException('No teams found'));

      await expect(leagueController.getTeamsInLeague('invalidLeagueId')).rejects.toThrow(NotFoundException);
      expect(mockLeagueService.getTeamsInLeague).toHaveBeenCalledWith('invalidLeagueId');
    });
  });
});
