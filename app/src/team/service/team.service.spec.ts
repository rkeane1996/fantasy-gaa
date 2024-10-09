import { Test, TestingModule } from '@nestjs/testing';
import { TeamService } from './team.service';
import { TeamRepository } from '../../../lib/team/repository/team.repository';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateTeamDTO } from '../dto/create-team.dto';
import { TeamTransferDTO } from '../dto/team-transfer.dto';
import { EditTeamInfoDto } from '../dto/edit-team-dto';
import { Team } from '../../../lib/team/schema/team.schema';
import { GetTeamResponseDto } from '../dto/get-team-dto';
import { TeamPlayer } from '../../../lib/team/schema/teamPlayer.entity';
import { County } from '../../../lib/common/enum/counties';

// Mock constants
const mockTeamPlayer: TeamPlayer = {
  playerId: 'player-id-1',
  position: 'Forward',
  county: County.Galway,
  price: 10,
  isCaptain: true,
  isViceCaptain: false,
  isSub: false,
};

const mockTeam: any = {
  id: 'team-id-1',
  userId: 'user-id-1',
  teamInfo: {
    teamName: 'TestTeam',
    jerseyColour: 'Blue',
    shortsColour: 'White',
  },
  players: [mockTeamPlayer],
  budget: 100,
  totalPoints: 50,
  transfers: {
    cost: 0,
    limit: 5,
    made: 0,
    freeTransfers: 0,
  },
} 

const mockCreateTeamDto: CreateTeamDTO = {
  userId: 'user-id-1',
  teamInfo: {
    teamName: 'TestTeam',
    jerseyColour: 'Blue',
    shortsColour: 'White',
  },
  players: [mockTeamPlayer],
  budget: 100,
};

const mockTeamTransferDto: TeamTransferDTO = {
  teamId: 'team-id-1',
  playersToAdd: [mockTeamPlayer],
  playersToReplace: [mockTeamPlayer],
};

const mockEditTeamInfoDto: EditTeamInfoDto = {
  teamId: 'team-id-1',
  teamName: 'UpdatedTestTeam',
  jerseyColour: 'Red',
  shortsColour: 'Black',
};

describe('TeamService', () => {
  let service: TeamService;
  let teamRepository: TeamRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamService,
        {
          provide: TeamRepository,
          useValue: {
            createTeam: jest.fn(),
            findTeamByTeamId: jest.fn(),
            findTeamByUserId: jest.fn(),
            swapPlayersInTeam: jest.fn(),
            editTeam: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TeamService>(TeamService);
    teamRepository = module.get<TeamRepository>(TeamRepository);
  });

  describe('createTeam', () => {
    it('should create a team and return the team ID', async () => {
      jest.spyOn(teamRepository, 'createTeam').mockResolvedValue(mockTeam);

      const result = await service.createTeam(mockCreateTeamDto);

      expect(teamRepository.createTeam).toHaveBeenCalledWith(mockCreateTeamDto);
      expect(result).toBe(mockTeam.id);
    });
  });

  describe('transferPlayers', () => {
    it('should transfer players and return the updated team DTO', async () => {
      jest.spyOn(teamRepository, 'findTeamByTeamId').mockResolvedValue(mockTeam);
      jest.spyOn(teamRepository, 'swapPlayersInTeam').mockResolvedValue(mockTeam);

      const result = await service.transferPlayers(mockTeamTransferDto);

      expect(teamRepository.findTeamByTeamId).toHaveBeenCalledWith('team-id-1');
      expect(teamRepository.swapPlayersInTeam).toHaveBeenCalled();
      expect(result).toEqual(expect.any(GetTeamResponseDto));
    });

    it('should throw BadRequestException when player counts do not match', async () => {
      const invalidTransferDto = { ...mockTeamTransferDto, playersToAdd: [] };

      await expect(service.transferPlayers(invalidTransferDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if player to replace is not in the current team', async () => {
      jest.spyOn(teamRepository, 'findTeamByTeamId').mockResolvedValue(mockTeam);

      const invalidReplaceDto = {
        ...mockTeamTransferDto,
        playersToReplace: [{ ...mockTeamPlayer, playerId: 'invalid-id' }],
      };

      await expect(service.transferPlayers(invalidReplaceDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if transfer exceeds budget', async () => {
      jest.spyOn(teamRepository, 'findTeamByTeamId').mockResolvedValue({
        ...mockTeam,
        budget: 1,
      });

      const expensivePlayerDto = {
        ...mockTeamTransferDto,
        playersToAdd: [{ ...mockTeamPlayer, price: 100 }],
      };

      await expect(service.transferPlayers(expensivePlayerDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getTeamByUserId', () => {
    it('should return a team by userId', async () => {
      jest.spyOn(teamRepository, 'findTeamByUserId').mockResolvedValue(mockTeam);

      const result = await service.getTeamByUserId('user-id-1');

      expect(teamRepository.findTeamByUserId).toHaveBeenCalledWith('user-id-1');
      expect(result).toEqual(expect.any(GetTeamResponseDto));
    });

    it('should throw NotFoundException if team is not found by userId', async () => {
      jest.spyOn(teamRepository, 'findTeamByUserId').mockResolvedValue(null);

      await expect(service.getTeamByUserId('user-id-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getTeamByTeamId', () => {
    it('should return a team by teamId', async () => {
      jest.spyOn(teamRepository, 'findTeamByTeamId').mockResolvedValue(mockTeam);

      const result = await service.getTeamByTeamId('team-id-1');

      expect(teamRepository.findTeamByTeamId).toHaveBeenCalledWith('team-id-1');
      expect(result).toEqual(expect.any(GetTeamResponseDto));
    });

    it('should throw NotFoundException if team is not found by teamId', async () => {
      jest.spyOn(teamRepository, 'findTeamByTeamId').mockResolvedValue(null);

      await expect(service.getTeamByTeamId('team-id-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateTeamInfo', () => {
    it('should update a team\'s info and return the updated team DTO', async () => {
      jest.spyOn(teamRepository, 'editTeam').mockResolvedValue(mockTeam);

      const result = await service.updateTeamInfo(mockEditTeamInfoDto);

      expect(teamRepository.editTeam).toHaveBeenCalledWith(mockEditTeamInfoDto);
      expect(result).toEqual(expect.any(GetTeamResponseDto));
    });
  });
});
