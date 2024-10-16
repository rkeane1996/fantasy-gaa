import { Test, TestingModule } from '@nestjs/testing';
import { GameweekService } from './gameweek.service';
import { GameweekRepository } from '../../../lib/gameweek/repository/gameweek.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateGameweekDto } from '../dto/request/create-gameweek.dto';
import { AddMatchesToGameweekDto } from '../dto/request/add-matches-to-gameweek.dto';
import { AddTeamsToGameweekDto } from '../dto/request/add-teams-to-gameweek.dto';
import { Gameweek } from '../../../lib/gameweek/schema/gameweek.schema';
import { County } from '../../../lib/common/enum/counties';

describe('GameweekService', () => {
  let service: GameweekService;
  let repository: GameweekRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameweekService,
        {
          provide: GameweekRepository,
          useValue: {
            createGameWeek: jest.fn(),
            addMatchesToGameweek: jest.fn(),
            addTeamsToGameweek: jest.fn(),
            getGameWeek: jest.fn(),
            getGameweekMatches: jest.fn(),
            getGameweekMatch: jest.fn(),
            getGameweekTeams: jest.fn(),
            getGameweekTeam: jest.fn(),
            activateDeactivateGameweek: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GameweekService>(GameweekService);
    repository = module.get<GameweekRepository>(GameweekRepository);
  });

  describe('createGameWeek', () => {
    it('should create a gameweek successfully', async () => {
      const gameweek: Gameweek = {
          gameweekNumber: 1,
          matches: [],
          gameweekTeams: [],
          transferDeadline: new Date(),
          isActive: true,
          id: '',
          dateCreated: undefined
      };

      const createGameweekDto: CreateGameweekDto = {
        gameweekNumber: 1,
        matches: [],
        transferDeadline: new Date(),
      };

      jest.spyOn(repository, 'createGameWeek').mockResolvedValue(gameweek);

      const result = await service.createGameWeek(createGameweekDto);

      expect(result.gameweekNumber).toBe(gameweek.gameweekNumber);
      expect(repository.createGameWeek).toHaveBeenCalledWith(createGameweekDto);
    });

    it('should throw BadRequestException if creation fails', async () => {
      const createGameweekDto: CreateGameweekDto = {
        gameweekNumber: 1,
        matches: [],
        transferDeadline: new Date(),
      };

      jest.spyOn(repository, 'createGameWeek').mockResolvedValue(null);

      await expect(service.createGameWeek(createGameweekDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('addMatchesToGameweek', () => {
    it('should add matches to gameweek successfully', async () => {
      const gameweek: Gameweek = {
          gameweekNumber: 1,
          matches: [],
          gameweekTeams: [],
          transferDeadline: new Date(),
          isActive: true,
          id: '',
          dateCreated: undefined
      };

      const addMatchesToGameweekDto: AddMatchesToGameweekDto = {
        gameweekNumber: 1,
        matches: ['match-1'],
      };

      jest.spyOn(repository, 'addMatchesToGameweek').mockResolvedValue(gameweek);

      const result = await service.addMatchesToGameweek(addMatchesToGameweekDto);

      expect(result.gameweekNumber).toBe(gameweek.gameweekNumber);
      expect(repository.addMatchesToGameweek).toHaveBeenCalledWith(
        addMatchesToGameweekDto.gameweekNumber,
        addMatchesToGameweekDto.matches,
      );
    });
  });

  describe('lockTeamsForGameweek', () => {
    it('should lock teams for gameweek', async () => {
      const gameweek: Gameweek = {
          gameweekNumber: 1,
          matches: [],
          gameweekTeams: [],
          transferDeadline: new Date(),
          isActive: true,
          id: '',
          dateCreated: undefined
      };

      const addTeamsToGameweekDto: AddTeamsToGameweekDto = {
        gameweekNumber: 1,
        teams: [
            {
                teamId: 'team-1',
                teamPlayers: []
            },
            {
                teamId: 'team-2',
                teamPlayers: []
            }, ],
      };

      jest.spyOn(repository, 'addTeamsToGameweek').mockResolvedValue(gameweek);

      const result = await service.lockTeamsForGameweek(addTeamsToGameweekDto);

      expect(result.gameweekNumber).toBe(gameweek.gameweekNumber);
      expect(repository.addTeamsToGameweek).toHaveBeenCalledWith(
        addTeamsToGameweekDto.gameweekNumber,
        addTeamsToGameweekDto.teams,
      );
    });
  });

  describe('getGameWeek', () => {
    it('should return a gameweek successfully', async () => {
      const gameweek: Gameweek = {
          gameweekNumber: 1,
          matches: [],
          gameweekTeams: [],
          transferDeadline: new Date(),
          isActive: true,
          id: '232',
          dateCreated: undefined
      };

      jest.spyOn(repository, 'getGameWeek').mockResolvedValue(gameweek);

      const result = await service.getGameWeek(1);

      expect(result.gameweekNumber).toBe(gameweek.gameweekNumber);
      expect(repository.getGameWeek).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if gameweek not found', async () => {
      jest.spyOn(repository, 'getGameWeek').mockResolvedValue(null);

      await expect(service.getGameWeek(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getGameWeekMatches', () => {
    it('should return matches for a gameweek', async () => {
      const matches = [{
        homeTeam: County.Antrim,
        awayTeam: County.Cork,
        homeScore: '0-00',
        awayScore: '0-00',
        playerPerformance: [],
        id: '123', 
        dateCreated: new Date()
      },{
        homeTeam: County.Antrim,
        awayTeam: County.Cork,
        homeScore: '0-00',
        awayScore: '0-00',
        playerPerformance: [],
        id: '123', 
        dateCreated: new Date()
      }];

      jest.spyOn(repository, 'getGameweekMatches').mockResolvedValue(matches);

      const result = await service.getGameWeekMatches(1);

      expect(result).toBe(matches);
      expect(repository.getGameweekMatches).toHaveBeenCalledWith(1);
    });
  });

  describe('getGameWeekMatch', () => {
    it('should return a match for a gameweek', async () => {
      const match = {
        homeTeam: County.Antrim,
        awayTeam: County.Cork,
        homeScore: '0-00',
        awayScore: '0-00',
        playerPerformance: [],
        id: '123', 
        dateCreated: new Date()
      };;

      jest.spyOn(repository, 'getGameweekMatch').mockResolvedValue(match);

      const result = await service.getGameWeekMatch(1, 'match-1');

      expect(result).toBe(match);
      expect(repository.getGameweekMatch).toHaveBeenCalledWith(1, 'match-1');
    });

    it('should throw NotFoundException if match not found', async () => {
      jest.spyOn(repository, 'getGameweekMatch').mockResolvedValue(null);

      await expect(
        service.getGameWeekMatch(1, 'match-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getGameWeekTeams', () => {
    it('should return teams for a gameweek', async () => {
      const teams = [
        {
            teamId: 'team-1',
            teamPlayers: []
        },
        {
            teamId: 'team-2',
            teamPlayers: []
        }, ];

      jest.spyOn(repository, 'getGameweekTeams').mockResolvedValue(teams);

      const result = await service.getGameWeekTeams(1);

      expect(result).toBe(teams);
      expect(repository.getGameweekTeams).toHaveBeenCalledWith(1);
    });
  });

  describe('getGameWeekTeam', () => {
    it('should return a team for a gameweek', async () => {
      const team = 
        {
            teamId: 'team-1',
            teamPlayers: []
        } ;

      jest.spyOn(repository, 'getGameweekTeam').mockResolvedValue(team);

      const result = await service.getGameWeekTeam(1, 'team-1');

      expect(result).toBe(team);
      expect(repository.getGameweekTeam).toHaveBeenCalledWith(1, 'team-1');
    });

    it('should throw NotFoundException if team not found', async () => {
      jest.spyOn(repository, 'getGameweekTeam').mockResolvedValue(null);

      await expect(
        service.getGameWeekTeam(1, 'team-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('activateDeactivateGameweek', () => {
    it('should activate or deactivate a gameweek', async () => {
      const gameweek: Gameweek = {
          gameweekNumber: 1,
          matches: [],
          gameweekTeams: [],
          transferDeadline: new Date(),
          isActive: false,
          id: '232',
          dateCreated: undefined
      };

      jest
        .spyOn(repository, 'activateDeactivateGameweek')
        .mockResolvedValue(gameweek);

      const result = await service.activateDeactivateGameweek(1, true);

      expect(result.isActive).toBe(gameweek.isActive);
      expect(repository.activateDeactivateGameweek).toHaveBeenCalledWith(1, true);
    });
  });
});
