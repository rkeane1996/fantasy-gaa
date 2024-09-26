import { Test, TestingModule } from '@nestjs/testing';
import { LeagueController } from './league.controller';
import { LeagueService } from '../service/league.service';
import { CreateLeagueDto } from '../dto/request/create-league.dto';
import { UserAuthGuard } from '../../auth/guards/user-auth.guard';
import { UserService } from '../../user/service/user.service';
import { JwtService } from '@nestjs/jwt';
import { JoinLeagueDto } from '../dto/request/join-league.dto';
import { GetLeagueResponseDto } from '../dto/response/get-league-reponse.dto';

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
        admin: 'ryrfy4734fhr',
      };

      const getLeagueResponseDto: GetLeagueResponseDto = {
        leagueId: 'f43-f436-h65g-3f4g',
        leagueName: 'Test League',
        teams: ['vfnvjk-45vrnk-4543', 'ffbhiv-454-vr445'],
        admin: 'ryrfy4734fhr',
        leagueCode: 'abc123',
        createdAt: new Date(),
      };

      jest
        .spyOn(service, 'createLeague')
        .mockResolvedValue(getLeagueResponseDto);

      const result = await controller.createLeague(createLeagueDto);

      expect(result).toEqual(getLeagueResponseDto);
      expect(service.createLeague).toHaveBeenCalledWith(createLeagueDto);
    });
  });

  describe('league/join', () => {
    it('user should be able to join league', async () => {
      const joinLeagueDto: JoinLeagueDto = {
        leagueCode: 'vfnvjk-45vrnk-4543',
        teamId: 'vjr-5gv54-gt45g-j76',
      };

      const getLeagueResponseDto: GetLeagueResponseDto = {
        leagueId: 'f43-f436-h65g-3f4g',
        leagueName: 'Test League',
        teams: ['v4g-6yh6j-6jh-h', 'vjr-5gv54-gt45g-j76'],
        admin: 'rhgferi54839',
        leagueCode: 'abc123',
        createdAt: new Date(),
      };

      jest.spyOn(service, 'joinLeague').mockResolvedValue(getLeagueResponseDto);

      const result = await controller.joinLeague(joinLeagueDto);

      expect(result).toEqual(getLeagueResponseDto);
      expect(service.joinLeague).toHaveBeenCalledWith(joinLeagueDto);
    });
  });

  describe('league/', () => {
    it('user should be able to get all leagues', async () => {
      const getLeagueResponseDto: GetLeagueResponseDto[] = [
        {
          leagueId: 'f43-f436-h65g-3f4g',
          leagueName: 'Test League',
          teams: ['v4g-6yh6j-6jh-h', 'gtgt-btb-5b6hbny-hnnb'],
          admin: 'vnr4g59gh',
          leagueCode: 'abc123',
          createdAt: new Date(),
        },
        {
          leagueId: 'f43-d346hb-v54t-3f4g',
          leagueName: 'Test League 1',
          teams: ['v4g-6yh6j-54h-h', 'gtgt-btb-5bgg5tg46hbny-hnnb'],
          admin: 'fheuif54',
          leagueCode: 'xyz987',
          createdAt: new Date(),
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
        leagueId: 'f43-f436-h65g-3f4g',
        leagueName: 'Test League',
        teams: ['v4g-6yh6j-6jh-h', 'gtgt-btb-5b6hbny-hnnb'],
        admin: 'fheuif54',
        leagueCode: 'xyz987',
        createdAt: new Date(),
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
});
