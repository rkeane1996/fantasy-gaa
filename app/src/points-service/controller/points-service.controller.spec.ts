import { Test, TestingModule } from '@nestjs/testing';
import { PointsServiceController } from './points-service.controller';
import { AdminAuthGuard } from '../../auth/guards/admin-auth.guard';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { PointsServiceService } from '../service/points-service.service';
import { UpdatePointsDto } from '../dto/update-points.dto';

describe('PointsServiceController', () => {
  let controller: PointsServiceController;
  let service: PointsServiceService;
  let app: INestApplication;

  const mockPointsService = {
    updatePoints: jest.fn().mockResolvedValue({
      playerId: '123',
      goals: 2,
      points: 50,
      yellowCards: 1,
      redCards: 0,
      minutes: 90,
      saves: 3,
      penaltySaves: 1,
      hooks: 0,
      blocks: 2,
      totalPoints: 55,
    }),
  };

  const validDto: UpdatePointsDto = {
    matchId: 'match123',
    playerPerformance: {
      playerId: 'player123',
      goals: 2,
      points: 50,
      yellowCards: 1,
      redCards: 0,
      minutes: 90,
      saves: 3,
      penaltySaves: 1,
      hooks: 0,
      blocks: 2,
      totalPoints: 55,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PointsServiceController],
      providers: [
        {
          provide: PointsServiceService,
          useValue: mockPointsService,
        },
      ],
    })
      .overrideGuard(AdminAuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe()); // To trigger validation
    await app.init();

    controller = module.get<PointsServiceController>(PointsServiceController);
    service = module.get<PointsServiceService>(PointsServiceService);
  });

  afterEach(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('updatePoints', () => {
    it('should call PointsServiceService with correct data and return PlayerPerformanceDto', async () => {
      const result = await controller.updatePoints(validDto);
      
      expect(service.updatePoints).toHaveBeenCalledWith(validDto);
      expect(result).toEqual({
        playerId: '123',
        goals: 2,
        points: 50,
        yellowCards: 1,
        redCards: 0,
        minutes: 90,
        saves: 3,
        penaltySaves: 1,
        hooks: 0,
        blocks: 2,
        totalPoints: 55,
      });
    });

    it('should throw validation error for invalid DTO', async () => {
      const invalidDto = {
        matchId: '',
        playerPerformance: {
          playerId: '',
          goals: -1,
          points: 'invalid',
          yellowCards: -1,
          redCards: -1,
          minutes: -90,
          saves: 'invalid',
          penaltySaves: -1,
          hooks: -1,
          blocks: -1,
          totalPoints: 'invalid',
        },
      };

      await request(app.getHttpServer())
        .post('/points-service/update/points')
        .send(invalidDto)
        .expect(400); // Expect validation to fail and return a 400 Bad Request
    });

    it('should return the updated player performance', async () => {
      await request(app.getHttpServer())
        .post('/points-service/update/points')
        .send(validDto)
        .expect(201)
        .expect({
          playerId: '123',
          goals: 2,
          points: 50,
          yellowCards: 1,
          redCards: 0,
          minutes: 90,
          saves: 3,
          penaltySaves: 1,
          hooks: 0,
          blocks: 2,
          totalPoints: 55,
        });
    });

    it('should handle errors from the service', async () => {
      jest.spyOn(service, 'updatePoints').mockRejectedValue(new Error('Service Error'));

      await expect(controller.updatePoints(validDto)).rejects.toThrow('Service Error');
    });
  });
});
