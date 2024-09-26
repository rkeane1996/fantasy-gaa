import { Test, TestingModule } from '@nestjs/testing';
import { TeamService } from './team.service';
import { TeamRepository } from '../repository/team.repository';
import { NotFoundException, HttpException } from '@nestjs/common';
import { CreateTeamDTO } from '../dto/create-team.dto';
import { TeamTransferDTO } from '../dto/team-transfer.dto';
import { County } from '../../../lib/common/enum/counties';
import { Team } from '../schema/team.schema';
import { Position } from '../../../lib/common/enum/position';

describe('TeamService', () => {
  let service: TeamService;
  let teamRepo: TeamRepository;

  const mockTeamRepo = {
    createTeam: jest.fn(),
    getTeamByTeamId: jest.fn(),
    transferPlayers: jest.fn(),
    getTeamByUserId: jest.fn(),
    getTeamByPlayerId: jest.fn(),
    updatePoints: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamService,
        {
          provide: TeamRepository,
          useValue: mockTeamRepo,
        },
      ],
    }).compile();

    service = module.get<TeamService>(TeamService);
    teamRepo = module.get<TeamRepository>(TeamRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTeam', () => {
    it('should create a new team and return the team id', async () => {
      const createTeamDto: CreateTeamDTO = {
        userId: '123',
        teamName: 'Test Team',
        players: [],
        budget: 100,
      };
      mockTeamRepo.createTeam.mockResolvedValue({ id: 'team123' });

      const result = await service.createTeam(createTeamDto);

      expect(teamRepo.createTeam).toHaveBeenCalledWith(createTeamDto);
      expect(result).toBe('team123');
    });
  });

  describe('getTeamByTeamId', () => {
    it('should return a team by teamId', async () => {
      const team = {
        _id: 'team123',
        userId: 'user123',
        teamName: 'Test Team',
        players: [],
        budget: 100,
        totalPoints: 0,
        gameweek: [
          {
            gameweek: 1,
            players: [
              {
                playerId: 'playerid',
                county: County.Galway,
                isCaptain: false,
                isSub: false,
                isViceCaptain: true,
                position: Position.DEFENDER,
                price: 12.3,
              },
            ],
            points: 23,
          },
        ],
      } as unknown as Team;
      mockTeamRepo.getTeamByTeamId.mockResolvedValue(team);

      const result = await service.getTeamByTeamId('team123');

      expect(teamRepo.getTeamByTeamId).toHaveBeenCalledWith('team123');
      expect(result.teamId).toBe(team._id);
    });

    it('should throw NotFoundException if team not found', async () => {
      mockTeamRepo.getTeamByTeamId.mockResolvedValue(null);

      await expect(service.getTeamByTeamId('team123')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('transferPlayers', () => {
    it('should transfer players and return updated team', async () => {
      const team = {
        _id: 'team123',
        userId: 'user123',
        teamName: 'Test Team',
        players: [],
        budget: 100,
        totalPoints: 0,
        gameweek: [
          {
            gameweek: 1,
            players: [
              {
                playerId: 'playerid',
                county: County.Galway,
                isCaptain: false,
                isSub: false,
                isViceCaptain: true,
                position: Position.DEFENDER,
                price: 12.3,
              },
            ],
            points: 23,
          },
        ],
      } as unknown as Team;

      const transferDto: TeamTransferDTO = {
        teamId: 'team123',
        playersIn: [],
        playersOut: [],
      };

      mockTeamRepo.getTeamByTeamId.mockResolvedValue(team);
      mockTeamRepo.transferPlayers.mockResolvedValue(team);

      const result = await service.transferPlayers(transferDto);

      expect(teamRepo.getTeamByTeamId).toHaveBeenCalledWith('team123');
      expect(teamRepo.transferPlayers).toHaveBeenCalledWith(
        'team123',
        transferDto.playersOut,
        transferDto.playersIn,
      );
      expect(result.teamId).toBe(team._id);
    });

    it('should throw an error if players in and out count does not match', async () => {
      const transferDto: TeamTransferDTO = {
        teamId: 'team123',
        playersIn: [
          {
            playerId: 'p1',
            position: 'Forward',
            county: County.Galway,
            price: 5,
            isCaptain: false,
            isViceCaptain: false,
            isSub: false,
          },
        ],
        playersOut: [],
      };

      await expect(service.transferPlayers(transferDto)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw an error if player out is not in the current team', async () => {
      const team = {
        _id: 'team123',
        userId: 'user123',
        teamName: 'Test Team',
        players: [],
        budget: 100,
        totalPoints: 0,
        gameweek: [
          {
            gameweek: 1,
            players: [
              {
                playerId: 'playerid',
                county: County.Galway,
                isCaptain: false,
                isSub: false,
                isViceCaptain: true,
                position: Position.DEFENDER,
                price: 12.3,
              },
            ],
            points: 23,
          },
        ],
      } as unknown as Team;

      const transferDto: TeamTransferDTO = {
        teamId: 'team123',
        playersIn: [],
        playersOut: [
          {
            playerId: 'p1',
            position: 'Forward',
            county: County.Galway,
            price: 5,
            isCaptain: false,
            isViceCaptain: false,
            isSub: false,
          },
        ],
      };

      mockTeamRepo.getTeamByTeamId.mockResolvedValue(team);

      await expect(service.transferPlayers(transferDto)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('updatePoints', () => {
    it('should update the team points and return the updated team', async () => {
      const team = {
        _id: 'team123',
        userId: 'user123',
        teamName: 'Test Team',
        players: [],
        budget: 100,
        totalPoints: 0,
        gameweek: [
          {
            gameweek: 1,
            players: [
              {
                playerId: 'playerid',
                county: County.Galway,
                isCaptain: false,
                isSub: false,
                isViceCaptain: true,
                position: Position.DEFENDER,
                price: 12.3,
              },
            ],
            points: 23,
          },
        ],
      } as unknown as Team;
      mockTeamRepo.updatePoints.mockResolvedValue(team);

      const result = await service.updatePoints('team123', 1, 10);

      expect(teamRepo.updatePoints).toHaveBeenCalledWith('team123', 1, 10);
      expect(result.teamId).toBe(team._id);
    });
  });
});
