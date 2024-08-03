import { Test, TestingModule } from '@nestjs/testing';
import { TeamController } from './team.controller';
import { TeamService } from '../service/team.service';
import { CreateTeamDTO } from '../dto/create-team.dto';
import { TeamTransferDTO } from '../dto/team-transfer.dto';
import { GetTeamResponseDto } from '../dto/get-team-dto';
import { UserAuthGuard } from '../../auth/guards/user-auth.guard';
import { HttpStatus } from '@nestjs/common';
import { County } from '../../../lib/common/enum/counties';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/service/user.service';

describe('TeamController', () => {
  let teamController: TeamController;
  let teamService: TeamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamController],
      providers: [
        {
          provide: TeamService,
          useValue: {
            createTeam: jest.fn(),
            transferPlayers: jest.fn(),
            getTeamByUserId: jest.fn(),
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
    }).compile();

    teamController = module.get<TeamController>(TeamController);
    teamService = module.get<TeamService>(TeamService);
  });

  it('should be defined', () => {
    expect(teamController).toBeDefined();
  });

  describe('addPlayer', () => {
    it('should create a team and return HttpStatus.CREATED', async () => {
      const createTeamDto: CreateTeamDTO = {
        userId: '234-fgre43rg5-43g',
        teamName: 'Best Team Ever',
        players: ['123f-53bf-4f74', '43bf-fdu5-fg54'],
      };

      jest
        .spyOn(teamService, 'createTeam')
        .mockResolvedValue(HttpStatus.CREATED);

      expect(await teamController.addPlayer(createTeamDto)).toBe(
        HttpStatus.CREATED,
      );
      expect(teamService.createTeam).toHaveBeenCalledWith(createTeamDto);
    });
  });

  describe('makeTransfer', () => {
    it('should make transfers and return the updated team', async () => {
      const transferDto: TeamTransferDTO = {
        teamId: 'h768-f687-s21-vr45v',
        playersIn: [
          { playerId: '432f43r-grt5-g54-fg45t', county: County.Cork },
        ],
        playersOut: [{ playerId: '123f-53bf-4f74', county: County.Cork }],
      };

      const responseDto: GetTeamResponseDto = {
        teamId: '54g-r43f-43fg-43f',
        userId: '543f54-t54g6-43fg-54g54',
        teamName: 'Best Team Ever',
        players: ['432f43r-grt5-g54-fg45t'],
      };

      jest.spyOn(teamService, 'transferPlayers').mockResolvedValue(responseDto);

      expect(await teamController.makeTransfer(transferDto)).toBe(responseDto);
      expect(teamService.transferPlayers).toHaveBeenCalledWith(transferDto);
    });

    it('should throw a BadRequestException if the transfer is invalid', async () => {
      const transferDto: TeamTransferDTO = {
        teamId: 'h768-f687-s21-vr45v',
        playersIn: [
          { playerId: '432f43r-grt5-g54-fg45t', county: County.Cork },
        ],
        playersOut: [{ playerId: '123f-53bf-4f74', county: County.Cork }],
      };

      jest.spyOn(teamService, 'transferPlayers').mockImplementation(() => {
        throw new Error(
          'Bad Request. Too many players from 1 county/More players in than out/Player not on team',
        );
      });

      await expect(teamController.makeTransfer(transferDto)).rejects.toThrow(
        Error,
      );
      expect(teamService.transferPlayers).toHaveBeenCalledWith(transferDto);
    });
  });

  describe('getUsersTeam', () => {
    it("should return the user's team", async () => {
      const userId = '543f54-t54g6-43fg-54g54';
      const responseDto: GetTeamResponseDto = {
        teamId: '54g-r43f-43fg-43f',
        userId: '543f54-t54g6-43fg-54g54',
        teamName: 'Best Team Ever',
        players: ['123f-53bf-4f74', '43bf-fdu5-fg54'],
      };

      jest.spyOn(teamService, 'getTeamByUserId').mockResolvedValue(responseDto);

      expect(await teamController.getUsersTeam(userId)).toBe(responseDto);
      expect(teamService.getTeamByUserId).toHaveBeenCalledWith(userId);
    });

    it('should throw a NotFoundException if the team is not found', async () => {
      const userId = '543f54-t54g6-43fg-54g54';

      jest.spyOn(teamService, 'getTeamByUserId').mockImplementation(() => {
        throw new Error('Team not found');
      });

      await expect(teamController.getUsersTeam(userId)).rejects.toThrow(Error);
      expect(teamService.getTeamByUserId).toHaveBeenCalledWith(userId);
    });
  });
});
