import { Test, TestingModule } from '@nestjs/testing';
import { TeamController } from './team.controller';
import { TeamService } from '../service/team.service';
import { CreateTeamDTO } from '../dto/create-team.dto';
import { TeamTransferDTO } from '../dto/team-transfer.dto';
import { GetTeamResponseDto } from '../dto/get-team-dto';
import { EditTeamInfoDto } from '../dto/edit-team-dto';
import { ExecutionContext } from '@nestjs/common';
import { RolesGuard } from '../../../src/auth/guards/roles.guard';
import { AuthGuard } from '../../../src/auth/guards/auth.guard';

describe('TeamController', () => {
  let controller: TeamController;
  let teamService: TeamService;

  const mockTeamService = {
    createTeam: jest.fn(),
    transferPlayers: jest.fn(),
    getTeamByUserId: jest.fn(),
    getTeamByTeamId: jest.fn(),
    updateTeamInfo: jest.fn(),
  };

  const mockUserAuthGuard = {
    canActivate: jest.fn((context: ExecutionContext) => true), // Always allow access
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamController],
      providers: [
        {
          provide: TeamService,
          useValue: mockTeamService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockUserAuthGuard)
      .overrideGuard(RolesGuard)
          .useValue({ canActivate: () => true }) // Mocking guard
      .compile();

    controller = module.get<TeamController>(TeamController);
    teamService = module.get<TeamService>(TeamService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTeam', () => {
    it('should create a new team successfully', async () => {
      const createTeamDto: CreateTeamDTO = {
        userId: 'user123',
        teamInfo: { teamName: 'Team A', jerseyColour: 'Blue', shortsColour: 'White' },
        players: [],
        budget: 100,
      };
      mockTeamService.createTeam.mockResolvedValue('team-created');

      const result = await controller.createTeam(createTeamDto);
      expect(result).toEqual('team-created');
      expect(teamService.createTeam).toHaveBeenCalledWith(createTeamDto);
    });
  });

  describe('makeTransfer', () => {
    it('should make a player transfer successfully', async () => {
      const transferDto: TeamTransferDTO = {
        teamId: 'team123',
        playersToAdd: [],
        playersToReplace: [],
      };
      const transferResponse: GetTeamResponseDto = {
        teamId: 'team123',
        userId: 'user123',
        teamInfo: { teamName: 'Test team', jerseyColour: 'Blue', shortsColour: 'White' },
        players: [],
        budget: 90,
        totalPoints: 100,
        transfers: { cost: 10, limit: 3, made: 1, freeTransfers: 1 },
      };
      mockTeamService.transferPlayers.mockResolvedValue(transferResponse);

      const result = await controller.makeTransfer(transferDto);
      expect(result).toEqual(transferResponse);
      expect(teamService.transferPlayers).toHaveBeenCalledWith(transferDto);
    });

    it('should handle bad transfer request', async () => {
      const transferDto: TeamTransferDTO = {
        teamId: 'team123',
        playersToAdd: [],
        playersToReplace: [],
      };
      mockTeamService.transferPlayers.mockRejectedValue(new Error('Transfer failed'));

      await expect(controller.makeTransfer(transferDto)).rejects.toThrow('Transfer failed');
      expect(teamService.transferPlayers).toHaveBeenCalledWith(transferDto);
    });
  });

  describe('getUsersTeam', () => {
    it('should return a user\'s team', async () => {
      const teamResponse: GetTeamResponseDto = {
        teamId: 'team123',
        userId: 'user123',
        teamInfo: { teamName: 'Test team', jerseyColour: 'Blue', shortsColour: 'White' },
        players: [],
        budget: 90,
        totalPoints: 100,
        transfers: { cost: 10, limit: 3, made: 1, freeTransfers: 1 },
      };
      mockTeamService.getTeamByUserId.mockResolvedValue(teamResponse);

      const result = await controller.getUsersTeam('user123');
      expect(result).toEqual(teamResponse);
      expect(teamService.getTeamByUserId).toHaveBeenCalledWith('user123');
    });

    it('should handle team not found', async () => {
      mockTeamService.getTeamByUserId.mockResolvedValue(null);

      const result = await controller.getUsersTeam('non-existent-user');
      expect(result).toBeNull();
      expect(teamService.getTeamByUserId).toHaveBeenCalledWith('non-existent-user');
    });
  });

  describe('getTeam', () => {
    it('should return a team by teamId', async () => {
      const teamResponse: GetTeamResponseDto = {
        teamId: 'team123',
        userId: 'user123',
        teamInfo: { teamName: 'Test team', jerseyColour: 'Blue', shortsColour: 'White' },
        players: [],
        budget: 90,
        totalPoints: 100,
        transfers: { cost: 10, limit: 3, made: 1, freeTransfers: 1 },
      };
      mockTeamService.getTeamByTeamId.mockResolvedValue(teamResponse);

      const result = await controller.getTeam('team123');
      expect(result).toEqual(teamResponse);
      expect(teamService.getTeamByTeamId).toHaveBeenCalledWith('team123');
    });

    it('should handle team not found', async () => {
      mockTeamService.getTeamByTeamId.mockResolvedValue(null);

      const result = await controller.getTeam('non-existent-team');
      expect(result).toBeNull();
      expect(teamService.getTeamByTeamId).toHaveBeenCalledWith('non-existent-team');
    });
  });

  describe('updateTeam', () => {
    it('should update team information successfully', async () => {
      const editTeamInfoDto: EditTeamInfoDto = {
        teamId: 'team123',
        teamName: 'Updated Team',
        jerseyColour: 'Red',
        shortsColour: 'Black',
      };
      const updatedTeamResponse: GetTeamResponseDto = {
        teamId: 'team123',
        userId: 'user123',
        teamInfo: { teamName: 'Updated Team', jerseyColour: 'Red', shortsColour: 'Black' },
        players: [],
        budget: 90,
        totalPoints: 100,
        transfers: { cost: 10, limit: 3, made: 1, freeTransfers: 1 },
      };
      mockTeamService.updateTeamInfo.mockResolvedValue(updatedTeamResponse);

      const result = await controller.updateTeam(editTeamInfoDto);
      expect(result).toEqual(updatedTeamResponse);
      expect(teamService.updateTeamInfo).toHaveBeenCalledWith(editTeamInfoDto);
    });

    it('should handle team not found', async () => {
      mockTeamService.updateTeamInfo.mockResolvedValue(null);

      const result = await controller.updateTeam({
        teamId: 'non-existent-team',
        teamName: 'Non-existent',
        jerseyColour: 'Grey',
        shortsColour: 'Grey',
      });
      expect(result).toBeNull();
      expect(teamService.updateTeamInfo).toHaveBeenCalledWith({
        teamId: 'non-existent-team',
        teamName: 'Non-existent',
        jerseyColour: 'Grey',
        shortsColour: 'Grey',
      });
    });
  });
});
