import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../service/user.service';
import { GetUserResponseDto } from '../dto/get-user-response.dto';
import { AuthGuard } from '../../../src/auth/guards/auth.guard';
import { RolesGuard } from '../../../src/auth/guards/roles.guard';
import { GetUserRequestDto } from '../dto/get-user-request.dto';
import { GAAClub } from '../../../lib/common/enum/club';
import { County } from '../../../lib/common/enum/counties';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const mockUserService = {
    getUsers: jest.fn(),
    findUsersByClub: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should return an array of users', async () => {
      const mockUsers: GetUserResponseDto[] = [
        {
          userId: '123',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          club: {
            clubName: GAAClub.BallyhaleShamrocks,
            county: County.Kilkenny,
          },
        },
      ];
      const dto: GetUserRequestDto = { userIds: ['123', '456'] };

      mockUserService.getUsers.mockResolvedValue(mockUsers);

      const result = await userController.getUsers(dto);

      expect(result).toEqual(mockUsers);
      expect(mockUserService.getUsers).toHaveBeenCalledWith(dto.userIds);
      expect(mockUserService.getUsers).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if service fails', async () => {
      const dto: GetUserRequestDto = { userIds: ['123', '456'] };
      mockUserService.getUsers.mockRejectedValue(new Error('Service Error'));

      await expect(userController.getUsers(dto)).rejects.toThrow(
        'Service Error',
      );
      expect(mockUserService.getUsers).toHaveBeenCalledWith(dto.userIds);
    });
  });

  describe('getUsersFromClub', () => {
    it('should return an array of user IDs from the specified club', async () => {
      const mockUsersFromClub = ['123', '456'];
      const clubName = GAAClub.BallyhaleShamrocks;

      mockUserService.findUsersByClub.mockResolvedValue(mockUsersFromClub);

      const result = await userController.getUsersFromClub(clubName);

      expect(result).toEqual(mockUsersFromClub);
      expect(mockUserService.findUsersByClub).toHaveBeenCalledWith(clubName);
      expect(mockUserService.findUsersByClub).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if service fails', async () => {
      const clubName = GAAClub.BallyhaleShamrocks;
      mockUserService.findUsersByClub.mockRejectedValue(
        new Error('Service Error'),
      );

      await expect(
        userController.getUsersFromClub(clubName),
      ).rejects.toThrow('Service Error');
      expect(mockUserService.findUsersByClub).toHaveBeenCalledWith(clubName);
    });
  });
});
