import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, NotFoundException } from '@nestjs/common';
import { LeagueService } from './league.service';
import { LeagueRepository } from '../repository/league.repository';
import { CreateLeagueDto } from '../dto/request/create-league.dto';
import { JoinLeagueDto } from '../dto/request/join-league.dto';
import { CreateLeagueResponseDto } from '../dto/response/create-league-response.dto';
import { GetLeagueResponseDto } from '../dto/response/get-league-reponse.dto';
import { League } from '../schema/league.schema';

describe('LeagueService', () => {
  let service: LeagueService;
  let leagueRepo: LeagueRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeagueService,
        {
          provide: LeagueRepository,
          useValue: {
            createLeague: jest.fn(),
            joinLeague: jest.fn(),
            findAllLeagues: jest.fn(),
            findLeague: jest.fn(),
            findTeamsInLeague: jest.fn(),
            findUsersInLeague: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LeagueService>(LeagueService);
    leagueRepo = module.get<LeagueRepository>(LeagueRepository);
  });

  describe('createLeague', () => {
    it('should create a league and return its id', async () => {
      const createLeagueDto: CreateLeagueDto = { leagueName: 'Test League' };
      const league: League = {
        leagueid: '123',
        leagueName: 'Test League',
        teams: [],
        users: [],
      };
      jest.spyOn(leagueRepo, 'createLeague').mockResolvedValue(league);

      const result = await service.createLeague(createLeagueDto);
      expect(result).toEqual(
        new CreateLeagueResponseDto({ id: league.leagueid }),
      );
      expect(leagueRepo.createLeague).toHaveBeenCalledWith(createLeagueDto);
    });
  });

  describe('joinLeague', () => {
    it('should allow a user to join a league and return created status', async () => {
      const joinLeagueDto: JoinLeagueDto = {
        leagueId: '123',
        teamId: 'abc',
        userId: '456',
      };

      await service.joinLeague(joinLeagueDto);
      expect(leagueRepo.joinLeague).toHaveBeenCalledWith(joinLeagueDto);
      expect(await service.joinLeague(joinLeagueDto)).toBe(HttpStatus.CREATED);
    });
  });

  describe('getLeagues', () => {
    it('should return an array of leagues', async () => {
      const leagues: League[] = [
        {
          leagueid: '123',
          leagueName: 'League 1',
          teams: [],
          users: [],
        },
      ];
      jest.spyOn(leagueRepo, 'findAllLeagues').mockResolvedValue(leagues);

      const result = await service.getLeagues();
      expect(result).toEqual(
        leagues.map((league) => new GetLeagueResponseDto(league)),
      );
      expect(leagueRepo.findAllLeagues).toHaveBeenCalled();
    });
  });

  describe('getLeague', () => {
    it('should return a league by id', async () => {
      const league: League = {
        leagueid: '123',
        leagueName: 'League 1',
        teams: [],
        users: [],
      };
      jest.spyOn(leagueRepo, 'findLeague').mockResolvedValue(league);

      const result = await service.getLeague('123');
      expect(result).toEqual(new GetLeagueResponseDto(league));
      expect(leagueRepo.findLeague).toHaveBeenCalledWith('123');
    });

    it('should throw a NotFoundException if the league is not found', async () => {
      jest.spyOn(leagueRepo, 'findLeague').mockResolvedValue(null);

      await expect(service.getLeague('123')).rejects.toThrow(NotFoundException);
      expect(leagueRepo.findLeague).toHaveBeenCalledWith('123');
    });
  });

  describe('getTeamsInLeague', () => {
    it('should return an array of teams in a league', async () => {
      const teams = ['Team 1'];
      jest.spyOn(leagueRepo, 'findTeamsInLeague').mockResolvedValue(teams);

      const result = await service.getTeamsInLeague('123');
      expect(result).toEqual(teams);
      expect(leagueRepo.findTeamsInLeague).toHaveBeenCalledWith('123');
    });

    it('should return an empty array if no teams are found', async () => {
      jest.spyOn(leagueRepo, 'findTeamsInLeague').mockResolvedValue([]);

      const result = await service.getTeamsInLeague('123');
      expect(result).toEqual([]);
      expect(leagueRepo.findTeamsInLeague).toHaveBeenCalledWith('123');
    });
  });

  describe('getUsersInLeague', () => {
    it('should return an array of users in a league', async () => {
      const users = ['User 1'];
      jest.spyOn(leagueRepo, 'findUsersInLeague').mockResolvedValue(users);

      const result = await service.getUsersInLeague('123');
      expect(result).toEqual(users);
      expect(leagueRepo.findUsersInLeague).toHaveBeenCalledWith('123');
    });

    it('should return an empty array if no users are found', async () => {
      jest.spyOn(leagueRepo, 'findUsersInLeague').mockResolvedValue([]);

      const result = await service.getUsersInLeague('123');
      expect(result).toEqual([]);
      expect(leagueRepo.findUsersInLeague).toHaveBeenCalledWith('123');
    });
  });
});
