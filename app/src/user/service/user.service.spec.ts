import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from '../repository/user.repository';
import { UserDTO } from '../dto/user.dto';
import { GetUserResponseDto } from '../dto/get-user-response.dto';
import { Role } from '../../auth/constants/roles';
import { GAAClub } from '../../../lib/common/enum/club';
import { County } from '../../../lib/common/enum/counties';

describe('UserService', () => {
  let service: UserService;
  let userRepo: UserRepository;

  const mockUserRepo = {
    createUser: jest.fn(),
    getUser: jest.fn(),
    deleteUser: jest.fn(),
    getUsers: jest.fn(),
    findUsersByClub: jest.fn(),
    getUserByEmail: jest.fn(),
  };

  const mockUser = {
    _id: 'user-id',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    club: { clubName: 'Club1', county: 'County1' },
    role: Role.User,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: mockUserRepo },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepo = module.get<UserRepository>(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const userDto: UserDTO = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'StrongPass123',
        dateOfBirth: new Date('1990-01-01'),
        club: { clubName: GAAClub.BallybodenStEndas, county: County.Antrim },
      };
      mockUserRepo.createUser.mockResolvedValue(mockUser);

      const result = await service.createUser(userDto);

      expect(userRepo.createUser).toHaveBeenCalledWith(userDto);
      expect(result).toEqual(mockUser);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user if found', async () => {
      mockUserRepo.getUser.mockResolvedValue(mockUser);

      await service.deleteUser('user-id');

      expect(userRepo.getUser).toHaveBeenCalledWith('user-id');
      expect(userRepo.deleteUser).toHaveBeenCalledWith('user-id');
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockUserRepo.getUser.mockResolvedValue(null);

      await expect(service.deleteUser('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(userRepo.getUser).toHaveBeenCalledWith('non-existent-id');
      expect(userRepo.deleteUser).not.toHaveBeenCalled();
    });
  });

  describe('getUser', () => {
    it('should return a user if found', async () => {
      mockUserRepo.getUser.mockResolvedValue(mockUser);

      const result = await service.getUser('user-id');

      expect(userRepo.getUser).toHaveBeenCalledWith('user-id');
      expect(result).toBeInstanceOf(GetUserResponseDto);
      expect(result.userId).toBe(mockUser._id);
      expect(result.firstName).toBe(mockUser.firstName);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockUserRepo.getUser.mockResolvedValue(null);

      await expect(service.getUser('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(userRepo.getUser).toHaveBeenCalledWith('non-existent-id');
    });
  });

  describe('getUsers', () => {
    it('should return an array of user response DTOs', async () => {
      mockUserRepo.getUsers.mockResolvedValue([mockUser]);

      const result = await service.getUsers();

      expect(userRepo.getUsers).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].userId).toBe(mockUser._id);
    });

    it('should return an empty array if no users found', async () => {
      mockUserRepo.getUsers.mockResolvedValue([]);

      const result = await service.getUsers();

      expect(userRepo.getUsers).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findUsersByClub', () => {
    it('should return an array of user IDs', async () => {
      mockUserRepo.findUsersByClub.mockResolvedValue([mockUser]);

      const result = await service.findUsersByClub('Club1');

      expect(userRepo.findUsersByClub).toHaveBeenCalledWith('Club1');
      expect(result).toEqual([mockUser._id]);
    });

    it('should return an empty array if no users found for the club', async () => {
      mockUserRepo.findUsersByClub.mockResolvedValue([]);

      const result = await service.findUsersByClub('NonExistentClub');

      expect(userRepo.findUsersByClub).toHaveBeenCalledWith('NonExistentClub');
      expect(result).toEqual([]);
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user by email', async () => {
      mockUserRepo.getUserByEmail.mockResolvedValue(mockUser);

      const result = await service.getUserbyEmail('john.doe@example.com');

      expect(userRepo.getUserByEmail).toHaveBeenCalledWith(
        'john.doe@example.com',
      );
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found by email', async () => {
      mockUserRepo.getUserByEmail.mockResolvedValue(null);

      const result = await service.getUserbyEmail('nonexistent@example.com');

      expect(userRepo.getUserByEmail).toHaveBeenCalledWith(
        'nonexistent@example.com',
      );
      expect(result).toBeNull();
    });
  });

  describe('getUserRole', () => {
    it('should return true if user role matches', async () => {
      mockUserRepo.getUser.mockResolvedValue(mockUser);

      const result = await service.getUserRole('user-id', Role.User);

      expect(userRepo.getUser).toHaveBeenCalledWith('user-id');
      expect(result).toBe(true);
    });

    it('should return false if user role does not match', async () => {
      mockUserRepo.getUser.mockResolvedValue(mockUser);

      const result = await service.getUserRole('user-id', Role.Admin);

      expect(userRepo.getUser).toHaveBeenCalledWith('user-id');
      expect(result).toBe(false);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockUserRepo.getUser.mockResolvedValue(null);

      await expect(
        service.getUserRole('non-existent-id', Role.User),
      ).rejects.toThrow(NotFoundException);
      expect(userRepo.getUser).toHaveBeenCalledWith('non-existent-id');
    });
  });
});
