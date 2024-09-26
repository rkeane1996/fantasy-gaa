import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../service/user.service';
import { GetUserResponseDto } from '../dto/get-user-response.dto';
import { UserAuthGuard } from '../../auth/guards/user-auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GAAClub } from '../../../lib/common/enum/club';
import { County } from '../../../lib/common/enum/counties';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            getUsers: jest.fn(),
            getUser: jest.fn(),
            findUsersByClub: jest.fn(),
            getUserRole: jest.fn(() => true),
          },
        },
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
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

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });
  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('getUsers', () => {
    it('should return an array of users', async () => {
      const result: GetUserResponseDto[] = [
        {
          userId: 'r438-43rtfv-6yjh6-g54y',
          firstName: 'Ronan',
          lastName: 'Keane',
          email: 'TEST@TESTING.COM',
          club: { clubName: GAAClub.Carnmore, county: County.Galway },
        },
      ];
      jest.spyOn(userService, 'getUsers').mockResolvedValue(result);

      expect(await userController.getUsers()).toBe(result);
      expect(userService.getUsers).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      jest
        .spyOn(userService, 'getUsers')
        .mockRejectedValue(new Error('Error retrieving users'));

      await expect(userController.getUsers()).rejects.toThrow(
        'Error retrieving users',
      );
    });
  });

  describe('getUser', () => {
    it('should return a user', async () => {
      const result: GetUserResponseDto = {
        userId: 'r438-43rtfv-6yjh6-g54y',
        firstName: 'Ronan',
        lastName: 'Keane',
        email: 'TEST@TESTING.COM',
        club: { clubName: GAAClub.Carnmore, county: County.Galway },
      };
      jest.spyOn(userService, 'getUser').mockResolvedValue(result);

      expect(await userController.getUser('r438-43rtfv-6yjh6-g54y')).toBe(
        result,
      );
      expect(userService.getUser).toHaveBeenCalledWith(
        'r438-43rtfv-6yjh6-g54y',
      );
    });

    it('should handle errors gracefully', async () => {
      jest
        .spyOn(userService, 'getUser')
        .mockRejectedValue(new Error('Error retrieving user'));

      await expect(
        userController.getUser('r438-43rtfv-6yjh6-g54y'),
      ).rejects.toThrow('Error retrieving user');
    });
  });

  describe('getUsersFromClub', () => {
    it('should return an array of user names from the club', async () => {
      const result: string[] = ['Ronan Keane'];
      jest.spyOn(userService, 'findUsersByClub').mockResolvedValue(result);

      expect(
        await userController.getUsersFromClub(GAAClub.BallybodenStEndas),
      ).toBe(result);
      expect(userService.findUsersByClub).toHaveBeenCalledWith(
        "Ballyboden St Enda's",
      );
    });

    it('should handle errors gracefully', async () => {
      jest
        .spyOn(userService, 'findUsersByClub')
        .mockRejectedValue(new Error('Error retrieving users from club'));

      await expect(
        userController.getUsersFromClub(GAAClub.Carnmore),
      ).rejects.toThrow('Error retrieving users from club');
    });
  });
});

// Mocking UserAuthGuard
class MockUserAuthGuard {
  canActivate(context: ExecutionContext): boolean {
    return true;
  }
}

describe('UserController with UserAuthGuard', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            getUsers: jest.fn(),
            getUser: jest.fn(),
            findUsersByClub: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(UserAuthGuard)
      .useValue(new MockUserAuthGuard())
      .compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  // Add the tests similar to the ones above to ensure that the guard is used correctly.
  // Ensure that the guard is invoked and that the methods still function correctly with the guard in place.

  describe('getUsers with UserAuthGuard', () => {
    it('should return an array of users', async () => {
      const result: GetUserResponseDto[] = [
        {
          userId: 'r438-43rtfv-6yjh6-g54y',
          firstName: 'Ronan',
          lastName: 'Keane',
          email: 'TEST@TESTING.COM',
          club: { clubName: GAAClub.Carnmore, county: County.Galway },
        },
      ];
      jest.spyOn(userService, 'getUsers').mockResolvedValue(result);

      expect(await userController.getUsers()).toBe(result);
      expect(userService.getUsers).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      jest
        .spyOn(userService, 'getUsers')
        .mockRejectedValue(new Error('Error retrieving users'));

      await expect(userController.getUsers()).rejects.toThrow(
        'Error retrieving users',
      );
    });
  });

  describe('getUser with UserAuthGuard', () => {
    it('should return a user', async () => {
      const result: GetUserResponseDto = {
        userId: 'r438-43rtfv-6yjh6-g54y',
        firstName: 'Ronan',
        lastName: 'Keane',
        email: 'TEST@TESTING.COM',
        club: { clubName: GAAClub.Carnmore, county: County.Galway },
      };
      jest.spyOn(userService, 'getUser').mockResolvedValue(result);

      expect(await userController.getUser('r438-43rtfv-6yjh6-g54y')).toBe(
        result,
      );
      expect(userService.getUser).toHaveBeenCalledWith(
        'r438-43rtfv-6yjh6-g54y',
      );
    });

    it('should handle errors gracefully', async () => {
      jest
        .spyOn(userService, 'getUser')
        .mockRejectedValue(new Error('Error retrieving user'));

      await expect(
        userController.getUser('r438-43rtfv-6yjh6-g54y'),
      ).rejects.toThrow('Error retrieving user');
    });
  });

  describe('getUsersFromClub with UserAuthGuard', () => {
    it('should return an array of user names from the club', async () => {
      const result: string[] = ['Ronan Keane'];
      jest.spyOn(userService, 'findUsersByClub').mockResolvedValue(result);

      expect(
        await userController.getUsersFromClub(GAAClub.CrossmaglenRangers),
      ).toBe(result);
      expect(userService.findUsersByClub).toHaveBeenCalledWith(
        'Crossmaglen Rangers',
      );
    });

    it('should handle errors gracefully', async () => {
      jest
        .spyOn(userService, 'findUsersByClub')
        .mockRejectedValue(new Error('Error retrieving users from club'));

      await expect(
        userController.getUsersFromClub(GAAClub.Corofin),
      ).rejects.toThrow('Error retrieving users from club');
    });
  });
});
