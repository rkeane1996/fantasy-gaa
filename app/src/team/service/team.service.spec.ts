import { Test, TestingModule } from '@nestjs/testing';
import { TeamService } from './team.service';
import { TeamRepository } from '../repository/team.repository';
import { CreateTeamDTO } from '../dto/create-team.dto';
import { TeamTransferDTO } from '../dto/team-transfer.dto';
import { GetTeamResponseDto } from '../dto/get-team-dto';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { County } from '../../../lib/common/enum/counties';

describe('TeamService', () => {
  let teamService: TeamService;
  let teamRepository: TeamRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamService,
        {
          provide: TeamRepository,
          useValue: {
            createTeam: jest.fn(),
            findPlayersOnTeam: jest.fn(),
            transferPlayers: jest.fn(),
            getTeamByTeamId: jest.fn(),
            getTeamByUserId: jest.fn(),
          },
        },
      ],
    }).compile();

    teamService = module.get<TeamService>(TeamService);
    teamRepository = module.get<TeamRepository>(TeamRepository);
  });
  it('should be defined', () => {
    expect(teamService).toBeDefined();
  });

  describe('createTeam', () => {
    it('should create a team and return HttpStatus.CREATED', async () => {
      const createTeamDto: CreateTeamDTO = {
        userId: '234-fgre43rg5-43g',
        teamName: 'Best Team Ever',
        players: ['123f-53bf-4f74', '43bf-fdu5-fg54'],
      };

      jest.spyOn(teamRepository, 'createTeam').mockResolvedValue(null);

      expect(await teamService.createTeam(createTeamDto)).toBe(
        HttpStatus.CREATED,
      );
      expect(teamRepository.createTeam).toHaveBeenCalledWith(createTeamDto);
    });
  });

  describe('transferPlayers', () => {
    it('should transfer players and return the updated team', async () => {
      const transferDto: TeamTransferDTO = {
        teamId: 'h768-f687-s21-vr45v',
        playersIn: [
          { playerId: '432f43r-grt5-g54-fg45t', county: County.Cork },
        ],
        playersOut: [{ playerId: '123f-53bf-4f74', county: County.Dublin }],
      };

      const teamPlayers = [
        { playerId: '123f-53bf-4f74', county: County.Cork },
        { playerId: '43bf-fdu5-fg54', county: County.Galway },
      ];

      const updatedTeam = {
        teamId: 'h768-f687-s21-vr45v',
        userId: '543f54-t54g6-43fg-54g54',
        teamName: 'Best Team Ever',
        players: [
          { playerId: '432f43r-grt5-g54-fg45t', county: County.Galway },
        ],
      };

      jest
        .spyOn(teamRepository, 'findPlayersOnTeam')
        .mockResolvedValue(teamPlayers);
      jest.spyOn(teamRepository, 'transferPlayers').mockResolvedValue(null);
      jest
        .spyOn(teamRepository, 'getTeamByTeamId')
        .mockResolvedValue(updatedTeam);

      const result = await teamService.transferPlayers(transferDto);
      expect(result).toEqual(teamService.createDtoResponse(updatedTeam));
    });

    it('should throw an error if players in and out length do not match', async () => {
      const transferDto: TeamTransferDTO = {
        teamId: 'h768-f687-s21-vr45v',
        playersIn: [
          { playerId: '432f43r-grt5-g54-fg45t', county: County.Cork },
        ],
        playersOut: [
          { playerId: '123f-53bf-4f74', county: County.Dublin },
          { playerId: '43bf-fdu5-fg54', county: County.Cork },
        ],
      };

      await expect(teamService.transferPlayers(transferDto)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw an error if a player being transferred out is not on the team', async () => {
      const transferDto: TeamTransferDTO = {
        teamId: 'h768-f687-s21-vr45v',
        playersIn: [
          { playerId: '432f43r-grt5-g54-fg45t', county: County.Cork },
        ],
        playersOut: [{ playerId: '123f-53bf-4f74', county: County.Dublin }],
      };

      const teamPlayers = [{ playerId: '43bf-fdu5-fg54', county: County.Cork }];

      jest
        .spyOn(teamRepository, 'findPlayersOnTeam')
        .mockResolvedValue(teamPlayers);

      await expect(teamService.transferPlayers(transferDto)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw an error if too many players are from the same county', async () => {
      const transferDto: TeamTransferDTO = {
        teamId: 'h768-f687-s21-vr45v',
        playersIn: [
          { playerId: '432f43r-grt5-g54-fg45t', county: County.Galway },
          { playerId: '765fg45-fg45-fg45', county: County.Galway },
        ],
        playersOut: [
          { playerId: '123f-53bf-4f74', county: County.Dublin },
          { playerId: '43bf-fdu5-fg54', county: County.Galway },
        ],
      };

      const teamPlayers = [
        { playerId: '43bf-fdu5-fg54', county: County.Galway },
        { playerId: 'gf4g5d-f4g5d-fg54', county: County.Galway },
      ];

      jest
        .spyOn(teamRepository, 'findPlayersOnTeam')
        .mockResolvedValue(teamPlayers);

      await expect(teamService.transferPlayers(transferDto)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('getTeamByUserId', () => {
    it("should return the user's team", async () => {
      const userId = '543f54-t54g6-43fg-54g54';
      const team = {
        teamId: '54g-r43f-43fg-43f',
        userId: '543f54-t54g6-43fg-54g54',
        teamName: 'Best Team Ever',
        players: [
          { playerId: '123f-53bf-4f74', county: County.Cork },
          { playerId: '43bf-fdu5-fg54', county: County.Cork },
        ],
      };

      jest.spyOn(teamRepository, 'getTeamByUserId').mockResolvedValue(team);

      const result = await teamService.getTeamByUserId(userId);
      expect(result).toEqual(teamService.createDtoResponse(team));
    });

    it('should throw a NotFoundException if the team is not found', async () => {
      const userId = '543f54-t54g6-43fg-54g54';

      jest.spyOn(teamRepository, 'getTeamByUserId').mockResolvedValue(null);

      await expect(teamService.getTeamByUserId(userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getTeamByTeamId', () => {
    it('should return the team by teamId', async () => {
      const teamId = '54g-r43f-43fg-43f';
      const team = {
        teamId: '54g-r43f-43fg-43f',
        userId: '543f54-t54g6-43fg-54g54',
        teamName: 'Best Team Ever',
        players: [
          { playerId: '123f-53bf-4f74', county: County.Cork },
          { playerId: '43bf-fdu5-fg54', county: County.Cork },
        ],
      };

      jest.spyOn(teamRepository, 'getTeamByTeamId').mockResolvedValue(team);

      const result = await teamService.getTeamByTeamId(teamId);
      expect(result).toEqual(teamService.createDtoResponse(team));
    });

    it('should throw a NotFoundException if the team is not found', async () => {
      const teamId = '54g-r43f-43fg-43f';

      jest.spyOn(teamRepository, 'getTeamByTeamId').mockResolvedValue(null);

      await expect(teamService.getTeamByTeamId(teamId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createDtoResponse', () => {
    it('should create and return a GetTeamResponseDto', () => {
      const team = {
        teamId: '54g-r43f-43fg-43f',
        userId: '543f54-t54g6-43fg-54g54',
        teamName: 'Best Team Ever',
        players: ['123f-53bf-4f74', '43bf-fdu5-fg54'],
      };

      const expectedResponse: GetTeamResponseDto = {
        teamId: '54g-r43f-43fg-43f',
        userId: '543f54-t54g6-43fg-54g54',
        teamName: 'Best Team Ever',
        players: ['123f-53bf-4f74', '43bf-fdu5-fg54'],
      };

      const result = teamService.createDtoResponse(team);
      expect(result).toEqual(expectedResponse);
    });
  });
});
