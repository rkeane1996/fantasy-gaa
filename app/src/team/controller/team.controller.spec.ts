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
        players: [
          {
            playerId: 'r43-gf34-gre',
            position: 'Forward',
            county: County.Galway,
            price: 5,
            isCaptain: true,
            isViceCaptain: false,
            isSub: false,
          },
          {
            playerId: 'r43-vfre54-bvrb6',
            position: 'Forward',
            county: County.Galway,
            price: 5,
            isCaptain: false,
            isViceCaptain: true,
            isSub: false,
          },
        ],
        budget: 50,
      };

      jest
        .spyOn(teamService, 'createTeam')
        .mockResolvedValue(HttpStatus.CREATED);

      expect(await teamController.addTeam(createTeamDto)).toBe(
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
          {
            playerId: 'r43-gf34-gre',
            position: 'Forward',
            county: County.Galway,
            price: 5,
            isCaptain: true,
            isViceCaptain: true,
            isSub: false,
          },
          ,
        ],
        playersOut: [
          {
            playerId: 'r43-fre5-gre',
            position: 'Forward',
            county: County.Galway,
            price: 5,
            isCaptain: true,
            isViceCaptain: true,
            isSub: false,
          },
        ],
      };

      const responseDto: GetTeamResponseDto = {
        teamId: '54g-r43f-43fg-43f',
        userId: '543f54-t54g6-43fg-54g54',
        teamName: 'Best Team Ever',
        players: [
          {
            playerId: 'r43-gf34-gre',
            position: 'Forward',
            county: County.Galway,
            price: 5,
            isCaptain: true,
            isViceCaptain: true,
            isSub: false,
          },
        ],
        budget: 50,
        totalPoints: 4,
        gameweekPoints: [
          {
            gameweek: 1,
            players: [
              {
                playerId: 'r43-gf34-gre',
                position: 'Forward',
                county: County.Galway,
                price: 5,
                isCaptain: true,
                isViceCaptain: true,
                isSub: false,
              },
            ],
            points: 4,
          },
        ],
      };

      jest.spyOn(teamService, 'transferPlayers').mockResolvedValue(responseDto);

      expect(await teamController.makeTransfer(transferDto)).toBe(responseDto);
      expect(teamService.transferPlayers).toHaveBeenCalledWith(transferDto);
    });

    it('should throw a BadRequestException if the transfer is invalid', async () => {
      const transferDto: TeamTransferDTO = {
        teamId: 'h768-f687-s21-vr45v',
        playersIn: [
          {
            playerId: 'r43-gf34-gre',
            position: 'Forward',
            county: County.Galway,
            price: 5,
            isCaptain: true,
            isViceCaptain: true,
            isSub: false,
          },
        ],
        playersOut: [
          {
            playerId: 'vfd4-gf34-vfd',
            position: 'Forward',
            county: County.Galway,
            price: 5,
            isCaptain: false,
            isViceCaptain: true,
            isSub: false,
          },
        ],
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
        players: [
          {
            playerId: 'r43-gf34-gre',
            position: 'Forward',
            county: County.Galway,
            price: 5,
            isCaptain: true,
            isViceCaptain: true,
            isSub: false,
          },
          {
            playerId: 'r43-gf34-gtrg-5gv',
            position: 'Forward',
            county: County.Galway,
            price: 5,
            isCaptain: true,
            isViceCaptain: true,
            isSub: false,
          },
        ],
        budget: 50,
        totalPoints: 4,
        gameweekPoints: [
          {
            gameweek: 1,
            players: [
              {
                playerId: 'r43-gf34-gre',
                position: 'Forward',
                county: County.Galway,
                price: 5,
                isCaptain: true,
                isViceCaptain: true,
                isSub: false,
              },
            ],
            points: 4,
          },
        ],
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

  describe('guards', () => {
    it('should apply UserAuthGuard to addTeam', () => {
      const guards = Reflect.getMetadata('__guards__', teamController.addTeam);
      expect(guards).toHaveLength(1);
      expect(guards[0]).toBe(UserAuthGuard);
    });

    it('should apply UserAuthGuard to makeTransfer', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        teamController.makeTransfer,
      );
      expect(guards).toHaveLength(1);
      expect(guards[0]).toBe(UserAuthGuard);
    });

    it('should apply UserAuthGuard to getUsersTeam', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        teamController.getUsersTeam,
      );
      expect(guards).toHaveLength(1);
      expect(guards[0]).toBe(UserAuthGuard);
    });
  });
});
