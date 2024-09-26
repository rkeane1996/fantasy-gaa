import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { LeagueService } from './league.service';
import { LeagueRepository } from '../repository/league.repository';
import { CreateLeagueDto } from '../dto/request/create-league.dto';
import { JoinLeagueDto } from '../dto/request/join-league.dto';
import { GetLeagueResponseDto } from '../dto/response/get-league-reponse.dto';
import { plainToInstance } from 'class-transformer';
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
            findLeagueByCode: jest.fn(),
            joinLeague: jest.fn(),
            findAllLeagues: jest.fn(),
            findLeague: jest.fn(),
            findTeamsInLeague: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LeagueService>(LeagueService);
    leagueRepo = module.get<LeagueRepository>(LeagueRepository);
  });

  describe('createLeague', () => {
    it('should create a league and return a GetLeagueResponseDto', async () => {
      const createLeagueDto: CreateLeagueDto = {
        leagueName: 'The Best League',
        admin: 'admin1',
        teams: ['team1', 'team2'],
      };

      const createdLeague = {
        leagueId: 'league1',
        leagueName: 'The Best League',
        admin: 'admin1',
        teams: ['team1', 'team2'],
        leagueCode: 'abcd1234',
        createdAt: new Date(),
      } as unknown as League;

      jest.spyOn(leagueRepo, 'createLeague').mockResolvedValue(createdLeague);

      const result = await service.createLeague(createLeagueDto);

      expect(leagueRepo.createLeague).toHaveBeenCalledWith(createLeagueDto);
      expect(result).toEqual(
        plainToInstance(GetLeagueResponseDto, { newLeague: createdLeague }),
      );
    });
  });

  describe('joinLeague', () => {
    it('should join a league if the league exists', async () => {
      const joinLeagueDto: JoinLeagueDto = {
        leagueCode: 'abcd1234',
        teamId: 'team1',
      };

      const existingLeague = {
        leagueId: 'league1',
        leagueName: 'The Best League',
        admin: 'admin1',
        teams: ['team1', 'team2'],
        leagueCode: 'abcd1234',
        createdAt: new Date(),
      } as unknown as League;

      jest
        .spyOn(leagueRepo, 'findLeagueByCode')
        .mockResolvedValue(existingLeague);
      jest.spyOn(leagueRepo, 'joinLeague').mockResolvedValue(existingLeague);

      const result = await service.joinLeague(joinLeagueDto);

      expect(leagueRepo.findLeagueByCode).toHaveBeenCalledWith(
        joinLeagueDto.leagueCode,
      );
      expect(leagueRepo.joinLeague).toHaveBeenCalledWith(joinLeagueDto);
      expect(result).toEqual(
        plainToInstance(GetLeagueResponseDto, existingLeague),
      );
    });

    it('should throw NotFoundException if the league does not exist', async () => {
      const joinLeagueDto: JoinLeagueDto = {
        leagueCode: 'abcd1234',
        teamId: 'team1',
      };

      jest.spyOn(leagueRepo, 'findLeagueByCode').mockResolvedValue(null);

      await expect(service.joinLeague(joinLeagueDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(leagueRepo.findLeagueByCode).toHaveBeenCalledWith(
        joinLeagueDto.leagueCode,
      );
    });
  });

  describe('getLeagues', () => {
    it('should return all leagues as GetLeagueResponseDto[]', async () => {
      const leagues = [
        {
          leagueId: 'league1',
          leagueName: 'The Best League',
          admin: 'admin1',
          teams: ['team1', 'team2'],
          leagueCode: 'abcd1234',
          createdAt: new Date(),
        },
        {
          leagueId: 'league2',
          leagueName: 'The Second League',
          admin: 'admin2',
          teams: ['team3', 'team4'],
          leagueCode: 'efgh5678',
          createdAt: new Date(),
        },
      ] as unknown as League[];

      jest.spyOn(leagueRepo, 'findAllLeagues').mockResolvedValue(leagues);

      const result = await service.getLeagues();

      expect(leagueRepo.findAllLeagues).toHaveBeenCalled();
      expect(result.length).toBe(2);
      expect(result).toEqual(
        leagues.map((league) => plainToInstance(GetLeagueResponseDto, league)),
      );
    });
  });

  describe('getLeague', () => {
    it('should return a league by id', async () => {
      const league = {
        leagueId: 'league1',
        leagueName: 'The Best League',
        admin: 'admin1',
        teams: ['team1', 'team2'],
        leagueCode: 'abcd1234',
        createdAt: new Date(),
      } as unknown as League;

      jest.spyOn(leagueRepo, 'findLeague').mockResolvedValue(league);

      const result = await service.getLeague('league1');

      expect(leagueRepo.findLeague).toHaveBeenCalledWith('league1');
      expect(result).toEqual(plainToInstance(GetLeagueResponseDto, league));
    });

    it('should throw NotFoundException if the league is not found', async () => {
      jest.spyOn(leagueRepo, 'findLeague').mockResolvedValue(null);

      await expect(service.getLeague('nonexistentLeague')).rejects.toThrow(
        NotFoundException,
      );
      expect(leagueRepo.findLeague).toHaveBeenCalledWith('nonexistentLeague');
    });
  });

  describe('getTeamsInLeague', () => {
    it('should return teams in a league', async () => {
      const teams = ['team1', 'team2', 'team3'];

      jest.spyOn(leagueRepo, 'findTeamsInLeague').mockResolvedValue(teams);

      const result = await service.getTeamsInLeague('league1');

      expect(leagueRepo.findTeamsInLeague).toHaveBeenCalledWith('league1');
      expect(result).toEqual(teams);
    });

    it('should return an empty array if no teams found', async () => {
      jest.spyOn(leagueRepo, 'findTeamsInLeague').mockResolvedValue([]);

      const result = await service.getTeamsInLeague('league1');

      expect(leagueRepo.findTeamsInLeague).toHaveBeenCalledWith('league1');
      expect(result).toEqual([]);
    });
  });
});
