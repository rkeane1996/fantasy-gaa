import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from '../repository/user.repository';
import { UserDTO } from '../dto/user.dto';
import { GetUserResponseDto } from '../dto/get-user-response.dto';
import { NotFoundException } from '@nestjs/common';
import { Role } from '../../auth/constants/roles';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  const mockUserRepository = {
    createUser: jest.fn(),
    deleteUser: jest.fn(),
    getUser: jest.fn(),
    getUsers: jest.fn(),
    findUsersByClub: jest.fn(),
    getUserByEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
  });
  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userDto: UserDTO = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'StrongPassword123',
        dateOfBirth: new Date('1990-01-01'),
        club: { clubName: 'Galway' } as any, // Assuming ClubDTO structure
      };

      mockUserRepository.createUser.mockResolvedValue(userDto);

      const result = await userService.createUser(userDto);
      expect(result).toEqual(userDto);
      expect(userRepository.createUser).toHaveBeenCalledWith(userDto);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user by ID', async () => {
      mockUserRepository.getUser.mockResolvedValue({ userId: '1' });
      mockUserRepository.deleteUser.mockResolvedValue(null);

      await userService.deleteUser('1');
      expect(userRepository.getUser).toHaveBeenCalledWith('1');
      expect(userRepository.deleteUser).toHaveBeenCalledWith('1');
    });

    it('should throw a NotFoundException if user does not exist', async () => {
      mockUserRepository.getUser.mockResolvedValue(null);

      await expect(userService.deleteUser('1')).rejects.toThrow(
        NotFoundException,
      );
      expect(userRepository.getUser).toHaveBeenCalledWith('1');
      expect(userRepository.deleteUser).not.toHaveBeenCalled();
    });
  });

  describe('getUser', () => {
    it('should return a user by ID', async () => {
      const user = { userId: '1', firstName: 'John', lastName: 'Doe' };
      const expectedResponse = new GetUserResponseDto();
      expectedResponse.userId = '1';
      expectedResponse.firstName = 'John';
      expectedResponse.lastName = 'Doe';

      mockUserRepository.getUser.mockResolvedValue(user);

      const result = await userService.getUser('1');
      expect(result).toEqual(expectedResponse);
      expect(userRepository.getUser).toHaveBeenCalledWith('1');
    });

    it('should throw a NotFoundException if user does not exist', async () => {
      mockUserRepository.getUser.mockResolvedValue(null);

      await expect(userService.getUser('1')).rejects.toThrow(NotFoundException);
      expect(userRepository.getUser).toHaveBeenCalledWith('1');
    });
  });

  describe('getUsers', () => {
    it('should return an array of users', async () => {
      const users = [
        { userId: '1', firstName: 'John', lastName: 'Doe' },
        { userId: '2', firstName: 'Jane', lastName: 'Smith' },
      ];
      const expectedResponse = users.map((user) => {
        const response = new GetUserResponseDto();
        response.userId = user.userId;
        response.firstName = user.firstName;
        response.lastName = user.lastName;
        return response;
      });

      mockUserRepository.getUsers.mockResolvedValue(users);

      const result = await userService.getUsers();
      expect(result).toEqual(expectedResponse);
      expect(userRepository.getUsers).toHaveBeenCalled();
    });

    it('should return an empty array if no users found', async () => {
      mockUserRepository.getUsers.mockResolvedValue([]);

      const result = await userService.getUsers();
      expect(result).toEqual([]);
      expect(userRepository.getUsers).toHaveBeenCalled();
    });
  });

  describe('findUsersByClub', () => {
    it('should return an array of user IDs from a club', async () => {
      const users = [
        { userId: '1', firstName: 'John', lastName: 'Doe' },
        { userId: '2', firstName: 'Jane', lastName: 'Smith' },
      ];
      const expectedResponse = users.map((user) => user.userId);

      mockUserRepository.findUsersByClub.mockResolvedValue(users);

      const result = await userService.findUsersByClub('Galway');
      expect(result).toEqual(expectedResponse);
      expect(userRepository.findUsersByClub).toHaveBeenCalledWith('Galway');
    });

    it('should return an empty array if no users found in the club', async () => {
      mockUserRepository.findUsersByClub.mockResolvedValue([]);

      const result = await userService.findUsersByClub('Galway');
      expect(result).toEqual([]);
      expect(userRepository.findUsersByClub).toHaveBeenCalledWith('Galway');
    });
  });

  describe('getUserbyEmail', () => {
    it('should return a user by email', async () => {
      const user = {
        userId: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      };

      mockUserRepository.getUserByEmail.mockResolvedValue(user);

      const result = await userService.getUserbyEmail('john.doe@example.com');
      expect(result).toEqual(user);
      expect(userRepository.getUserByEmail).toHaveBeenCalledWith(
        'john.doe@example.com',
      );
    });
  });

  describe('getUserRole', () => {
    it('should return true if the user has the specified role', async () => {
      const user = { userId: '1', role: Role.Admin };

      mockUserRepository.getUser.mockResolvedValue(user);

      const result = await userService.getUserRole('1', Role.Admin);
      expect(result).toBe(true);
      expect(userRepository.getUser).toHaveBeenCalledWith('1');
    });

    it('should return false if the user does not have the specified role', async () => {
      const user = { userId: '1', role: Role.User };

      mockUserRepository.getUser.mockResolvedValue(user);

      const result = await userService.getUserRole('1', Role.Admin);
      expect(result).toBe(false);
      expect(userRepository.getUser).toHaveBeenCalledWith('1');
    });

    it('should throw a NotFoundException if user does not exist', async () => {
      mockUserRepository.getUser.mockResolvedValue(null);

      await expect(userService.getUserRole('1', Role.Admin)).rejects.toThrow(
        NotFoundException,
      );
      expect(userRepository.getUser).toHaveBeenCalledWith('1');
    });
  });

  describe('createResponseDto', () => {
    it('should create and return a GetUserResponseDto', () => {
      const user = { userId: '1', firstName: 'John', lastName: 'Doe' };
      const expectedResponse = new GetUserResponseDto();
      expectedResponse.userId = '1';
      expectedResponse.firstName = 'John';
      expectedResponse.lastName = 'Doe';

      const result = userService.createResponseDto(user);
      expect(result).toEqual(expectedResponse);
    });
  });
});
