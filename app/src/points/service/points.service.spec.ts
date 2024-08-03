import { Test, TestingModule } from '@nestjs/testing';
import { PointsService } from './points.service';
import { PointsRepository } from '../repository/points.repository';
import { AddPlayerGameweekPoints } from '../dto/request/add-player-gameweek-points.dto';
import { AddTeamGameweekPoints } from '../dto/request/add-team-gameweek-points.dto';
import { GetPlayerGameweekPoints } from '../dto/request/get-player-gameweek-points.dto';
import { GetTeamGameweekPoints } from '../dto/request/get-team-gameweek-points.dto';
import { AddPointTypes } from '../dto/request/add-point-type.dto';
import { TeamPoints } from '../schema/team-points.schema';
import { Points } from '../schema/points.schema';
import { IPlayerPoints } from '../interface/player-points.interface';
import { ITeamPoints } from '../interface/team-points.interface';

describe('PointsService', () => {
  let service: PointsService;
  let repository: PointsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PointsService,
        {
          provide: PointsRepository,
          useValue: {
            insertPlayerPoints: jest.fn(),
            lockGameWeekTeam: jest.fn(),
            findPlayerPoints: jest.fn(),
            findTeamPoints: jest.fn(),
            insertPointType: jest.fn(),
            getPointTypes: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PointsService>(PointsService);
    repository = module.get<PointsRepository>(PointsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addPlayerPoints', () => {
    it('should insert player points', async () => {
      const dto: AddPlayerGameweekPoints = {
        playerId: '123',
        gameweekNumber: 2,
        points: [{ pointType: 'Point Scored', pointValue: 1 }],
      };

      await service.addPlayerPoints(dto);
      expect(repository.insertPlayerPoints).toHaveBeenCalledWith(dto);
    });
  });

  describe('addTeamPoints', () => {
    it('should insert team points', async () => {
      const dto: AddTeamGameweekPoints = {
        teamId: '123',
        gameweekNumber: 2,
        totalPoints: 23,
        playerIds: ['123', '4566', '456']
      };

      await service.lockGameWeekTeam(dto);
      expect(repository.lockGameWeekTeam).toHaveBeenCalledWith(dto);
    });
  });

  describe('getPlayerPoints', () => {
    it('should return player points', async () => {
      const dto: GetPlayerGameweekPoints = {
        playerId: '123',
        gameweekNumber: [1, 2],
      };
      const points: IPlayerPoints[] = [
        {
          playerId: '123',
          gameweekNumber: 1,
          points: [{ pointType: 'Point Scored', pointValue: 1 }],
        },
        {
          playerId: '123',
          gameweekNumber: 2,
          points: [{ pointType: 'Point Scored', pointValue: 2 }],
        },
      ];

      jest.spyOn(repository, 'findPlayerPoints').mockResolvedValueOnce(points);

      const result = await service.getPlayerPoints(dto);

      expect(result.points).toEqual([
        { gameweek: 1, points: 1, pointTypes: points[0].points },
        { gameweek: 2, points: 2, pointTypes: points[1].points },
      ]);
      expect(repository.findPlayerPoints).toHaveBeenCalledWith(dto.playerId);
    });

    it('should return an empty response if no points found', async () => {
      const dto: GetPlayerGameweekPoints = {
        playerId: '123',
        gameweekNumber: [1, 2],
      };

      jest.spyOn(repository, 'findPlayerPoints').mockResolvedValueOnce(null);

      const result = await service.getPlayerPoints(dto);

      expect(result.points).toEqual([]);
      expect(repository.findPlayerPoints).toHaveBeenCalledWith(dto.playerId);
    });
  });

  describe('getTeamPoints', () => {
    it('should return team points', async () => {
      const dto: GetTeamGameweekPoints = {
        teamId: '123',
        gameweekNumber: [1, 2],
      };
      const points: ITeamPoints[] = [
        {
          teamId: '123',
          gameweekNumber: 1,
          totalPoints: 10,
          playerIds: ['vre', 'r43f', 'fr34']
        },
        {
          teamId: '123',
          gameweekNumber: 2,
          totalPoints: 15,
          playerIds: ['vre', 'df34', 'fr34']
        },
      ];

      jest.spyOn(repository, 'findTeamPoints').mockResolvedValueOnce(points);

      const result = await service.getTeamPoints(dto);

      expect(result.points).toEqual([
        { gameweek: 1, points: 10 },
        { gameweek: 2, points: 15 },
      ]);
      expect(repository.findTeamPoints).toHaveBeenCalledWith(dto.teamId);
    });

    it('should return an empty response if no points found', async () => {
      const dto: GetTeamGameweekPoints = {
        teamId: '123',
        gameweekNumber: [1, 2],
      };

      jest.spyOn(repository, 'findTeamPoints').mockResolvedValueOnce(null);

      const result = await service.getTeamPoints(dto);

      expect(result.points).toEqual([]);
      expect(repository.findTeamPoints).toHaveBeenCalledWith(dto.teamId);
    });
  });

  describe('addPointTypes', () => {
    it('should insert point types', async () => {
      const dto: AddPointTypes = {
        pointType: 'POINT_SCORED',
        pointDescription: 'Scoring a point',
        pointValue: 1,
      };

      await service.addPointTypes(dto);
      expect(repository.insertPointType).toHaveBeenCalledWith(dto);
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

      jest.spyOn(repository, 'getPointTypes').mockResolvedValueOnce(pointTypes);

      const result = await service.getPointTypes();
      expect(result).toEqual(pointTypes);
      expect(repository.getPointTypes).toHaveBeenCalled();
    });

    it('should return an empty array if no point types found', async () => {
      jest.spyOn(repository, 'getPointTypes').mockResolvedValueOnce(null);

      const result = await service.getPointTypes();
      expect(result).toEqual([]);
      expect(repository.getPointTypes).toHaveBeenCalled();
    });
  });
});
