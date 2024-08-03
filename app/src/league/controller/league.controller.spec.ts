import { Test, TestingModule } from '@nestjs/testing';
import { LeagueController } from './league.controller';
import { LeagueService } from '../service/league.service';
import { CreateLeagueResponseDto } from '../dto/response/create-league-response.dto';
import { CreateLeagueDto } from '../dto/request/create-league.dto';
import { HttpStatus } from '@nestjs/common';
import { UserAuthGuard } from '../../auth/guards/user-auth.guard';
import { UserService } from '../../user/service/user.service';
import { JwtService } from '@nestjs/jwt';
import { JoinLeagueDto } from '../dto/request/join-league.dto';

describe('LeagueController', () => {
  let controller: LeagueController;
  let service: LeagueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeagueController],
      providers: [
        {
          provide: LeagueService,
          useValue: {
            createLeague: jest.fn(),
            joinLeague: jest.fn(),
            getLeagues: jest.fn(),
            getLeague: jest.fn(),
            getTeamsInLeague: jest.fn(),
            getUsersInLeague: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            getUserRole: jest.fn(() => true),
          },
        },
        {
          provide: UserAuthGuard, // Provide the UserAuthGuard
          useValue: {
            canActivate: jest.fn(() => true),
          }, // Use the mock class instead
        },
      ],
    }) // Mocking the guard to always allow access
      .compile();

    controller = module.get<LeagueController>(LeagueController);
    service = module.get<LeagueService>(LeagueService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('league/create', () => {
    it('should create a league', async () => {
      const createLeagueDto: CreateLeagueDto = {
        leagueName: 'Test League',
        teams: ['vfnvjk-45vrnk-4543', 'ffbhiv-454-vr445'],
        users: ['cbfjk45-vrt54-vbr6', 'fjrv-5468g-54'],
      };

      const createLeagueResponseDto: CreateLeagueResponseDto = {
        id: '123-abc-456',
      };

      jest
        .spyOn(service, 'createLeague')
        .mockResolvedValue(createLeagueResponseDto);

      const result = await controller.createLeague(createLeagueDto);

      expect(result).toEqual(createLeagueResponseDto);
      expect(service.createLeague).toHaveBeenCalledWith(createLeagueDto);
    });
  });

  describe('league/join', () => {
    it('user should be able to join league', async () => {
      const joinLeagueDto: JoinLeagueDto = {
        leagueId: 'vfnvjk-45vrnk-4543',
        teamId: 'vjr-5gv54-gt45g-j76',
        userId: 'g54-g7h-bu786b-g5',
      };

      jest.spyOn(service, 'joinLeague').mockResolvedValue(HttpStatus.CREATED);

      const result = await controller.joinLeague(joinLeagueDto);

      expect(result).toEqual(HttpStatus.CREATED);
      expect(service.joinLeague).toHaveBeenCalledWith(joinLeagueDto);
    });
  });

  describe('league/', () => {
    it('user should be able to get all leagues', async () => {
      const getLeagueResponseDto = [
        {
          leagueid: 'f43-f436-h65g-3f4g',
          leagueName: 'Test League',
          teams: ['v4g-6yh6j-6jh-h', 'gtgt-btb-5b6hbny-hnnb'],
          users: ['gt4-gh6h-h-trgn-y6h', 'f-g5gh6hg6-5h67jh-5h65j-fg54'],
        },
        {
          leagueid: 'f43-d346hb-v54t-3f4g',
          leagueName: 'Test League 1',
          teams: ['v4g-6yh6j-54h-h', 'gtgt-btb-5bgg5tg46hbny-hnnb'],
          users: ['gt4-gh6h-vrtebgtbh-trgn-y6h', 'f-f54y765-5h67jh-5h65j-fg54'],
        },
      ];

      jest.spyOn(service, 'getLeagues').mockResolvedValue(getLeagueResponseDto);

      const result = await controller.getLeagues();

      expect(result).toEqual(getLeagueResponseDto);
      expect(service.getLeagues).toHaveBeenCalled();
    });
  });

  describe('league/id', () => {
    it('user should be able to get specific league', async () => {
      const getLeagueResponseDto = {
        leagueid: 'f43-f436-h65g-3f4g',
        leagueName: 'Test League',
        teams: ['v4g-6yh6j-6jh-h', 'gtgt-btb-5b6hbny-hnnb'],
        users: ['gt4-gh6h-h-trgn-y6h', 'f-g5gh6hg6-5h67jh-5h65j-fg54'],
      };
      jest.spyOn(service, 'getLeague').mockResolvedValue(getLeagueResponseDto);

      const result = await controller.getLeague('f43-f436-h65g-3f4g');

      expect(result).toEqual(getLeagueResponseDto);
      expect(service.getLeague).toHaveBeenCalled();
    });
  });

  describe('league/id/teams', () => {
    it('get teams in a league', async () => {
      const teamIds = ['v4g-6yh6j-6jh-h', 'gtgt-btb-5b6hbny-hnnb'];
      jest.spyOn(service, 'getTeamsInLeague').mockResolvedValue(teamIds);

      const result = await controller.getTeamsInLeague('f43-f436-h65g-3f4g');

      expect(result).toEqual(teamIds);
      expect(service.getTeamsInLeague).toHaveBeenCalled();
    });
  });

  describe('league/id/users', () => {
    it('get users in a league', async () => {
      const userIds = ['v4g-6yh6j-6jh-h', 'gtgt-btb-5b6hbny-hnnb'];
      jest.spyOn(service, 'getUsersInLeague').mockResolvedValue(userIds);

      const result = await controller.getUsersInLeague('f43-f436-h65g-3f4g');

      expect(result).toEqual(userIds);
      expect(service.getUsersInLeague).toHaveBeenCalled();
    });
  });
});
