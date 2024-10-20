import { Test, TestingModule } from '@nestjs/testing';
import { PointsServiceService } from './points-service.service';
import { MatchRepository } from '../../../lib/match/repository/match.repository';
import { PlayerRepository } from '../../../lib/player/repository/player.repository';
import { GameweekRepository } from '../../../lib/gameweek/repository/gameweek.repository';
import { TeamRepository } from '../../../lib/team/repository/team.repository';
import { NotFoundException } from '@nestjs/common';
import { UpdatePointsDto } from '../dto/update-points.dto';
import { PlayerPerformanceDto } from '../../../src/match/dto/player-performance.dto';
import { Points } from '../../../lib/points/enum/points.enum';
import { County } from '../../../lib/common/enum/counties';
import { Position } from '../../../lib/common/enum/position';
import { GAAClub } from '../../../lib/common/enum/club';
import { Status } from '../../../lib/player/constants/status.enum';

describe('PointsServiceService', () => {
  let service: PointsServiceService;
  let matchRepository: MatchRepository;
  let playerRepository: PlayerRepository;
  let gameweekRepository: GameweekRepository;
  let teamRepository: TeamRepository;

  const mockMatchRepository = {
    findMatch: jest.fn(),
    updatePlayerPerformance: jest.fn(),
  };

  const mockPlayer = {
    playerName: 'Test',
    profilePictureUrl: 'www.tes.com',
    position: Position.FORWARD,
    club: GAAClub.Corofin,
    county: County.Clare,
    status: Status.AVAILABLE,
    price: 7,
    totalPoints: 8,
    id: '121',
    dateCreated: new Date()
  }

  const mockPlayerRepository = {
    addTotalPoints: jest.fn(),
  };

  const mockGameweekRepository = {
    getTeamsThatOwnSpecificPlayer: jest.fn(),
    updateGameweekPointsForTeam: jest.fn(),
  };

  const mockTeamRepository = {
    addTotalPoints: jest.fn(),
  };

  const mockPlayerPerformance: PlayerPerformanceDto = {
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
  };

  const mockMatch = {
    matchId: '1',
    homeTeam: County.Antrim,
    awayTeam: County.Cork,
    homeScore: '1-10',
    awayScore: '0-12',
    id: '123', 
    gameweek: 1,
    dateCreated: new Date(),
    playerPerformance: [mockPlayerPerformance],
  };

  const validDto: UpdatePointsDto = {
    matchId: 'match123',
    playerPerformance: {
      playerId: 'player123',
      goals: 3,
      points: 60,
      yellowCards: 1,
      redCards: 0,
      minutes: 90,
      saves: 4,
      penaltySaves: 2,
      hooks: 1,
      blocks: 3,
      totalPoints: 0,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PointsServiceService,
        { provide: MatchRepository, useValue: mockMatchRepository },
        { provide: PlayerRepository, useValue: mockPlayerRepository },
        { provide: GameweekRepository, useValue: mockGameweekRepository },
        { provide: TeamRepository, useValue: mockTeamRepository },
      ],
    }).compile();

    service = module.get<PointsServiceService>(PointsServiceService);
    matchRepository = module.get<MatchRepository>(MatchRepository);
    playerRepository = module.get<PlayerRepository>(PlayerRepository);
    gameweekRepository = module.get<GameweekRepository>(GameweekRepository);
    teamRepository = module.get<TeamRepository>(TeamRepository);
  });

  describe('updatePoints', () => {
    it('should update player performance and points successfully', async () => {
      // Mock successful findMatch call
      jest.spyOn(matchRepository, 'findMatch').mockResolvedValue(mockMatch);

      // Mock teams that own player
      jest.spyOn(gameweekRepository, 'getTeamsThatOwnSpecificPlayer').mockResolvedValue([{
        teamId: 'team123',
        teamPlayers: [],
        teamPoints: 0
      }]);
    

      // Mock successful updates
      jest.spyOn(matchRepository, 'updatePlayerPerformance').mockResolvedValue(mockMatch);
      jest.spyOn(playerRepository, 'addTotalPoints').mockResolvedValue(mockPlayer);
      jest.spyOn(gameweekRepository, 'updateGameweekPointsForTeam').mockResolvedValue();
      jest.spyOn(teamRepository, 'addTotalPoints').mockResolvedValue();

      const result = await service.updatePoints(validDto);

      // Check that the repositories were called correctly
      expect(matchRepository.findMatch).toHaveBeenCalledWith(validDto.matchId);
      expect(gameweekRepository.getTeamsThatOwnSpecificPlayer).toHaveBeenCalledWith(
        mockMatch.gameweek,
        validDto.playerPerformance.playerId,
      );
      expect(matchRepository.updatePlayerPerformance).toHaveBeenCalled();
      expect(playerRepository.addTotalPoints).toHaveBeenCalled();
      expect(gameweekRepository.updateGameweekPointsForTeam).toHaveBeenCalled();
      expect(teamRepository.addTotalPoints).toHaveBeenCalled();

      // Check the result
      expect(result.playerId).toEqual(mockPlayerPerformance.playerId);
    });

  });

  describe('updatePlayerPerf', () => {
    it('should update player performance fields', () => {
      const player = { ...mockPlayerPerformance };
      service['updatePlayerPerf'](player, validDto.playerPerformance);

      expect(player.goals).toEqual(validDto.playerPerformance.goals);
      expect(player.points).toEqual(validDto.playerPerformance.points);
      expect(player.minutes).toEqual(validDto.playerPerformance.minutes);
    });
  });

  describe('calculateTotalPoints', () => {
    it('should correctly calculate total points', () => {
      const player = { ...mockPlayerPerformance, goals: 2, minutes: 90 };
      const totalPoints = service['calculateTotalPoints'](player);

      expect(totalPoints).toBe(
        player.goals * Points.GOAL +
          Points.FULL_GAME_PLAYED +
          player.points * Points.POINT +
          player.yellowCards * Points.YELLOW_CARD +
          player.redCards * Points.RED_CARD +
          player.saves * Points.SAVES +
          player.penaltySaves * Points.PENALTY_SAVE +
          player.hooks * Points.HOOK +
          player.blocks * Points.BLOCK
      );
    });

    it('should give less points if player plays less than 50 minutes', () => {
      const player = { ...mockPlayerPerformance, goals: 1, minutes: 45 };
      const totalPoints = service['calculateTotalPoints'](player);

      expect(totalPoints).toBe(
        player.goals * Points.GOAL +
          Points.LESS_THAN_50_MINS_PLAYED +
          player.points * Points.POINT +
          player.yellowCards * Points.YELLOW_CARD +
          player.redCards * Points.RED_CARD +
          player.saves * Points.SAVES +
          player.penaltySaves * Points.PENALTY_SAVE +
          player.hooks * Points.HOOK +
          player.blocks * Points.BLOCK
      );
    });
  });
});
