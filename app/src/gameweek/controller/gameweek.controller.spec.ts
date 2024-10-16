import { Test, TestingModule } from '@nestjs/testing';
import { GameweekController } from './gameweek.controller';
import { GameweekService } from '../service/gameweek.service';
import { GetGameweekResponseDto } from '../dto/response/get-gameweek-repsonse.dto';
import { GameweekTeam } from '../../../lib/gameweek/schema/gameweek.team.schema';
import { Match } from '../../../lib/match/schema/match.schema';
import { AdminAuthGuard } from '../../../src/auth/guards/admin-auth.guard';
import { CreateGameweekDto } from '../dto/request/create-gameweek.dto';
import { AddMatchesToGameweekDto } from '../dto/request/add-matches-to-gameweek.dto';
import { AddTeamsToGameweekDto } from '../dto/request/add-teams-to-gameweek.dto';
import { ActivateDeactivateGameweekDto } from '../dto/request/start-end-gameweek.dto';

describe('GameweekController', () => {
  let controller: GameweekController;
  let gameweekService: GameweekService;

  const mockGameweekService = {
    createGameWeek: jest.fn(),
    addMatchesToGameweek: jest.fn(),
    lockTeamsForGameweek: jest.fn(),
    getGameWeek: jest.fn(),
    getGameWeekMatches: jest.fn(),
    getGameWeekTeams: jest.fn(),
    getGameWeekTeam: jest.fn(),
    activateDeactivateGameweek: jest.fn(),
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
    }).overrideGuard(AdminAuthGuard)
    .useValue({ canActivate: () => true }).compile();

    controller = module.get<GameweekController>(GameweekController);
    gameweekService = module.get<GameweekService>(GameweekService);
  });

  describe('createGameWeek', () => {
    it('should create a new gameweek and return it', async () => {
      const createGameweekDto: CreateGameweekDto = {
        gameweekNumber: 1,
        matches: ['matchid-1', 'matchid-2'],
        transferDeadline: new Date(),
      };

      const expectedResult: GetGameweekResponseDto = {
        gameweekNumber: 1,
        matches: ['matchid-1', 'matchid-2'],
        gameweekTeams: [],
        transferDeadline: new Date(),
        isActive: false,
        id:'123',
        dateCreated: new Date()
      };

      mockGameweekService.createGameWeek.mockResolvedValue(expectedResult);

      const result = await controller.createGameWeek(createGameweekDto);

      expect(gameweekService.createGameWeek).toHaveBeenCalledWith(createGameweekDto);
      expect(result).toEqual(expectedResult);
    });

    it('should throw an error if createGameWeek fails', async () => {
      const createGameweekDto: CreateGameweekDto = {
        gameweekNumber: 1,
        matches: ['matchid-1', 'matchid-2'],
        transferDeadline: new Date(),
      };

      mockGameweekService.createGameWeek.mockRejectedValue(new Error('Creation failed'));

      await expect(controller.createGameWeek(createGameweekDto)).rejects.toThrow('Creation failed');
    });
  });

  describe('addMatchesToGameweek', () => {
    it('should add matches to a gameweek and return the updated gameweek', async () => {
      const addMatchesDto: AddMatchesToGameweekDto = {
        gameweekNumber: 1,
        matches: ['matchid-1', 'matchid-2'],
      };

      const expectedResult: GetGameweekResponseDto = {
        gameweekNumber: 1,
        matches: ['matchid-1', 'matchid-2'],
        gameweekTeams: [],
        transferDeadline: new Date(),
        isActive: false,
        id: '',
        dateCreated: undefined
      };

      mockGameweekService.addMatchesToGameweek.mockResolvedValue(expectedResult);

      const result = await controller.addMatchesToGameweek(addMatchesDto);

      expect(gameweekService.addMatchesToGameweek).toHaveBeenCalledWith(addMatchesDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('addTeamsToGameweek', () => {
    it('should add teams to a gameweek', async () => {
      const addTeamsDto: AddTeamsToGameweekDto = {
        gameweekNumber: 1,
        teams: [],
      };

      const expectedResult: GetGameweekResponseDto = {
        gameweekNumber: 1,
        matches: [],
        gameweekTeams: [],
        transferDeadline: new Date(),
        isActive: false,
        id: '',
        dateCreated: undefined
      };

      mockGameweekService.lockTeamsForGameweek.mockResolvedValue(expectedResult);

      const result = await controller.addTeamsToGameweek(addTeamsDto);

      expect(gameweekService.lockTeamsForGameweek).toHaveBeenCalledWith(addTeamsDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getGameWeek', () => {
    it('should get a gameweek by its number', async () => {
      const gameweekNumber = 1;
      const expectedResult: GetGameweekResponseDto = {
        gameweekNumber: 1,
        matches: [],
        gameweekTeams: [],
        transferDeadline: new Date(),
        isActive: false,
        id: '',
        dateCreated: undefined
      };

      mockGameweekService.getGameWeek.mockResolvedValue(expectedResult);

      const result = await controller.getGameWeek(gameweekNumber);

      expect(gameweekService.getGameWeek).toHaveBeenCalledWith(gameweekNumber);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('startEndGameweek', () => {
    it('should activate or deactivate a gameweek', async () => {
      const activateDeactivateDto: ActivateDeactivateGameweekDto = {
        gameweekNumber: 1,
        isActive: true,
      };

      const updatedGameweek = {
        gameweekNumber: 1,
        isActive: true,
      };

      mockGameweekService.activateDeactivateGameweek.mockResolvedValue(updatedGameweek);

      const result = await controller.startEndGameweek(activateDeactivateDto);

      expect(gameweekService.activateDeactivateGameweek).toHaveBeenCalledWith(1, true);
      expect(result).toEqual({
        message: 'Gameweek 1 is now active',
        gameweek: updatedGameweek,
      });
    });
  });

  describe('getGameWeekMatches', () => {
    it('should return the matches for a given gameweek', async () => {
      const gameweekNumber = 1;
      const matches: Match[] = [];

      mockGameweekService.getGameWeekMatches.mockResolvedValue(matches);

      const result = await controller.getGameWeekMatches(gameweekNumber);

      expect(gameweekService.getGameWeekMatches).toHaveBeenCalledWith(gameweekNumber);
      expect(result).toEqual(matches);
    });
  });

  describe('getGameWeekTeams', () => {
    it('should return the teams for a given gameweek', async () => {
      const gameweekNumber = 1;
      const teams: GameweekTeam[] = [];

      mockGameweekService.getGameWeekTeams.mockResolvedValue(teams);

      const result = await controller.getGameWeekTeams(gameweekNumber);

      expect(gameweekService.getGameWeekTeams).toHaveBeenCalledWith(gameweekNumber);
      expect(result).toEqual(teams);
    });
  });

  describe('getGameWeekTeam', () => {
    it('should return a specific team for a given gameweek and team ID', async () => {
      const gameweekNumber = 1;
      const teamId = 'teamid-1';
      const team: GameweekTeam = {
        teamId,
        teamPlayers: [],
      };

      mockGameweekService.getGameWeekTeam.mockResolvedValue(team);

      const result = await controller.getGameWeekTeam(gameweekNumber, teamId);

      expect(gameweekService.getGameWeekTeam).toHaveBeenCalledWith(gameweekNumber, teamId);
      expect(result).toEqual(team);
    });
  });
});
