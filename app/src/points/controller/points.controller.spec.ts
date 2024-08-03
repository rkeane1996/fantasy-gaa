import { Test, TestingModule } from '@nestjs/testing';
import { PointsController } from './points.controller';
import { PointsService } from '../service/points.service';
import { AddPlayerGameweekPoints } from '../dto/request/add-player-gameweek-points.dto';
import { AddTeamGameweekPoints } from '../dto/request/add-team-gameweek-points.dto';
import { GetGameweekPointsResponse } from '../dto/response/get-gameweek-points.dto';
import { GetTeamGameweekPoints } from '../dto/request/get-team-gameweek-points.dto';
import { GetPlayerGameweekPoints } from '../dto/request/get-player-gameweek-points.dto';
import { AddPointTypes } from '../dto/request/add-point-type.dto';
import { Points } from '../schema/points.schema';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/service/user.service';
import { AdminAuthGuard } from '../../auth/guards/admin-auth.guard';

describe('PointsController', () => {
  let controller: PointsController;
  let service: PointsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PointsController],
      providers: [
        {
          provide: PointsService,
          useValue: {
            addPlayerPoints: jest.fn(),
            lockGameWeekTeam: jest.fn(),
            getTeamPoints: jest.fn(),
            getPlayerPoints: jest.fn(),
            addPointTypes: jest.fn(),
            getPointTypes: jest.fn(),
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
          provide: AdminAuthGuard, // Provide the UserAuthGuard
          useValue: {
            canActivate: jest.fn(() => true),
          }, // Use the mock class instead
        },
      ],
    }).compile();

    controller = module.get<PointsController>(PointsController);
    service = module.get<PointsService>(PointsService);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addPlayerPoints', () => {
    it('should add player points', async () => {
      const dto: AddPlayerGameweekPoints = {
        playerId: '123',
        gameweekNumber: 2,
        points: [{ pointType: 'Point Scored', pointValue: 1 }],
      };

      jest.spyOn(service, 'addPlayerPoints').mockResolvedValueOnce();

      await expect(controller.addPlayerPoints(dto)).resolves.toBeUndefined();
      expect(service.addPlayerPoints).toHaveBeenCalledWith(dto);
    });
  });

  describe('addTeamPoints', () => {
    it('should add team points', async () => {
      const dto: AddTeamGameweekPoints = {
        teamId: '123',
        gameweekNumber: 2,
        totalPoints: 23,
        playerIds: ['324', 'e32e']
      };

      jest.spyOn(service, 'lockGameWeekTeam').mockResolvedValueOnce();

      await expect(controller.addTeamPoints(dto)).resolves.toBeUndefined();
      expect(service.lockGameWeekTeam).toHaveBeenCalledWith(dto);
    });
  });

  describe('getTeamPoints', () => {
    it('should return team points', async () => {
      const dto: GetTeamGameweekPoints = {
        teamId: '123',
        gameweekNumber: [1, 2],
      };
      const response: GetGameweekPointsResponse = {
        points: [
          { gameweek: 1, points: 10 },
          { gameweek: 2, points: 15 },
        ],
      };

      jest.spyOn(service, 'getTeamPoints').mockResolvedValueOnce(response);

      const result = await controller.getTeamPoints(dto);
      expect(result).toEqual(response);
      expect(service.getTeamPoints).toHaveBeenCalledWith(dto);
    });
  });

  describe('getPlayerPoints', () => {
    it('should return player points', async () => {
      const dto: GetPlayerGameweekPoints = {
        playerId: '123',
        gameweekNumber: [1, 2],
      };
      const response: GetGameweekPointsResponse = {
        points: [
          { gameweek: 1, points: 5 },
          { gameweek: 2, points: 7 },
        ],
      };

      jest.spyOn(service, 'getPlayerPoints').mockResolvedValueOnce(response);

      const result = await controller.getPlayerPoints(dto);
      expect(result).toEqual(response);
      expect(service.getPlayerPoints).toHaveBeenCalledWith(dto);
    });
  });

  describe('addPointType', () => {
    it('should add a new point type', async () => {
      const dto: AddPointTypes = {
        pointType: 'POINT_SCORED',
        pointDescription: 'Scoring a point',
        pointValue: 1,
      };

      jest.spyOn(service, 'addPointTypes').mockResolvedValueOnce();

      await expect(controller.addPointType(dto)).resolves.toBeUndefined();
      expect(service.addPointTypes).toHaveBeenCalledWith(dto);
    });
  });

  describe('getPointTypes', () => {
    it('should return all point types', async () => {
      const pointTypes: Points[] = [
        {
          pointType: 'POINT_SCORED',
          pointDescription: 'Scoring a point',
          pointValue: 1,
        },
      ];

      jest.spyOn(service, 'getPointTypes').mockResolvedValueOnce(pointTypes);

      const result = await controller.getPointTypes();
      expect(result).toEqual(pointTypes);
      expect(service.getPointTypes).toHaveBeenCalled();
    });
  });
});
