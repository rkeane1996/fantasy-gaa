import { Test, TestingModule } from '@nestjs/testing';
import { PointsController } from './points.controller';
import { PointsService } from '../service/points.service';
import { AddPoints } from '../dto/add-gameweek-points.dto';
import { AdminAuthGuard } from '../../auth/guards/admin-auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { AddGameweekPointsResponseDto } from '../dto/add-gameweek-points.response.dto';

// Mock PointsService
const mockPointsService = {
  addPoints: jest.fn(),
};

// Mock AdminAuthGuard
const mockAdminAuthGuard = {
  canActivate: jest.fn((context: ExecutionContext) => true),
};

describe('PointsController', () => {
  let controller: PointsController;
  let pointsService: PointsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PointsController],
      providers: [
        {
          provide: PointsService,
          useValue: mockPointsService,
        },
      ],
    })
      .overrideGuard(AdminAuthGuard)
      .useValue(mockAdminAuthGuard)
      .compile();

    controller = module.get<PointsController>(PointsController);
    pointsService = module.get<PointsService>(PointsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addPlayerPoints', () => {
    const mockAddPointsDto: AddPoints = {
      playerId: '324-4fvrefv-43fvre-4fre',
      matchId: '324-4fvrefv-43fvre-4fre',
      points: [{ pointType: 'Point Scored', pointValue: 1 }],
    };

    const mockResponse: AddGameweekPointsResponseDto = {
      playerId: '324-4fvrefv-43fvre-4fre',
      totalPoints: 10,
      gameweekPoints: [{ gameweek: 1, points: 10 }],
    };

    it('should call PointsService.addPoints with correct arguments', async () => {
      mockPointsService.addPoints.mockResolvedValue(mockResponse);

      const result = await controller.addPlayerPoints(mockAddPointsDto);

      expect(pointsService.addPoints).toHaveBeenCalledWith(mockAddPointsDto);
      expect(result).toEqual(mockResponse);
    });

    it('should return the response from PointsService', async () => {
      mockPointsService.addPoints.mockResolvedValue(mockResponse);

      const result = await controller.addPlayerPoints(mockAddPointsDto);

      expect(result).toEqual(mockResponse);
    });

    it('should throw an error if PointsService throws an error', async () => {
      mockPointsService.addPoints.mockRejectedValue(
        new Error('Something went wrong'),
      );

      await expect(
        controller.addPlayerPoints(mockAddPointsDto),
      ).rejects.toThrow('Something went wrong');
    });
  });
});
