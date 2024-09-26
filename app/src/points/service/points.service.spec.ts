import { Test, TestingModule } from '@nestjs/testing';
import { PointsService } from './points.service';
import { GameweekService } from '../../../src/gameweek/service/gameweek.service';
import { PlayerService } from '../../../src/player/service/player.service';
import { TeamService } from '../../../src/team/service/team.service';
import { AddPoints } from '../dto/add-gameweek-points.dto';
import { AddGameweekPointsResponseDto } from '../dto/add-gameweek-points.response.dto';
import { plainToInstance } from 'class-transformer';

// Mock external services
const mockGameweekService = {
  updatePlayerPointsScoredInMatch: jest.fn(),
};

const mockPlayerService = {
  updatePlayerPoints: jest.fn(),
};

const mockTeamService = {
  getTeamByPlayerId: jest.fn(),
  updatePoints: jest.fn(),
};

describe('PointsService', () => {
  let service: PointsService;
  let gameweekService: GameweekService;
  let playerService: PlayerService;
  let teamService: TeamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PointsService,
        { provide: GameweekService, useValue: mockGameweekService },
        { provide: PlayerService, useValue: mockPlayerService },
        { provide: TeamService, useValue: mockTeamService },
      ],
    }).compile();

    service = module.get<PointsService>(PointsService);
    gameweekService = module.get<GameweekService>(GameweekService);
    playerService = module.get<PlayerService>(PlayerService);
    teamService = module.get<TeamService>(TeamService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addPoints', () => {
    const mockAddPointsDto: AddPoints = {
      playerId: 'player-123',
      matchId: 'match-456',
      points: [
        { pointType: 'Goal Scored', pointValue: 5 },
        { pointType: 'Assist', pointValue: 3 },
      ],
    };

    const mockUpdatedMatch = {
      matchId: 'match-456',
      gameweek: 2,
    };

    const mockPlayer = {
      playerId: 'player-123',
      totalPoints: 50,
      gameweekPoints: [{ gameweek: 2, points: 8 }],
    };

    const mockTeams = [
      {
        teamId: 'team-789',
        players: [{ playerId: 'player-123', isSub: false }],
      },
    ];

    it('should update match schema and calculate total gameweek points', async () => {
      // Mock responses for services
      mockGameweekService.updatePlayerPointsScoredInMatch.mockResolvedValue(
        mockUpdatedMatch,
      );
      mockPlayerService.updatePlayerPoints.mockResolvedValue(mockPlayer);
      mockTeamService.getTeamByPlayerId.mockResolvedValue(mockTeams);
      mockTeamService.updatePoints.mockResolvedValue({});

      const result = await service.addPoints(mockAddPointsDto);

      // Ensure correct methods are called with correct arguments
      expect(
        gameweekService.updatePlayerPointsScoredInMatch,
      ).toHaveBeenCalledWith(
        mockAddPointsDto.playerId,
        mockAddPointsDto.matchId,
        mockAddPointsDto.points,
      );
      expect(playerService.updatePlayerPoints).toHaveBeenCalledWith(
        mockAddPointsDto.playerId,
        mockUpdatedMatch.gameweek,
        8, // Total points for the gameweek
      );
      expect(teamService.getTeamByPlayerId).toHaveBeenCalledWith(
        mockPlayer.playerId,
      );
      expect(teamService.updatePoints).toHaveBeenCalledWith(
        'team-789',
        mockUpdatedMatch.gameweek,
        8,
      );

      // Ensure correct response is returned
      const expectedResponse = plainToInstance(AddGameweekPointsResponseDto, {
        playerId: mockPlayer.playerId,
        totalPoints: mockPlayer.totalPoints,
        gameweekPoints: mockPlayer.gameweekPoints,
      });
      expect(result).toEqual(expectedResponse);
    });

    it('should not update team points if player is a substitute', async () => {
      const mockTeamsWithSub = [
        {
          teamId: 'team-789',
          players: [{ playerId: 'player-123', isSub: true }],
        },
      ];

      // Mock responses
      mockGameweekService.updatePlayerPointsScoredInMatch.mockResolvedValue(
        mockUpdatedMatch,
      );
      mockPlayerService.updatePlayerPoints.mockResolvedValue(mockPlayer);
      mockTeamService.getTeamByPlayerId.mockResolvedValue(mockTeamsWithSub);

      const result = await service.addPoints(mockAddPointsDto);

      expect(teamService.updatePoints).not.toHaveBeenCalled();

      const expectedResponse = plainToInstance(AddGameweekPointsResponseDto, {
        playerId: mockPlayer.playerId,
        totalPoints: mockPlayer.totalPoints,
        gameweekPoints: mockPlayer.gameweekPoints,
      });
      expect(result).toEqual(expectedResponse);
    });

    it('should throw an error if updatePlayerPointsScoredInMatch fails', async () => {
      mockGameweekService.updatePlayerPointsScoredInMatch.mockRejectedValue(
        new Error('Match update failed'),
      );

      await expect(service.addPoints(mockAddPointsDto)).rejects.toThrow(
        'Match update failed',
      );
    });

    it('should throw an error if updatePlayerPoints fails', async () => {
      mockGameweekService.updatePlayerPointsScoredInMatch.mockResolvedValue(
        mockUpdatedMatch,
      );
      mockPlayerService.updatePlayerPoints.mockRejectedValue(
        new Error('Player update failed'),
      );

      await expect(service.addPoints(mockAddPointsDto)).rejects.toThrow(
        'Player update failed',
      );
    });

    it('should throw an error if getTeamByPlayerId fails', async () => {
      mockGameweekService.updatePlayerPointsScoredInMatch.mockResolvedValue(
        mockUpdatedMatch,
      );
      mockPlayerService.updatePlayerPoints.mockResolvedValue(mockPlayer);
      mockTeamService.getTeamByPlayerId.mockRejectedValue(
        new Error('Team lookup failed'),
      );

      await expect(service.addPoints(mockAddPointsDto)).rejects.toThrow(
        'Team lookup failed',
      );
    });
  });
});
