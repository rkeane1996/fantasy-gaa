import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { UserDTO } from '../dto/user.dto';
import { GetUserResponseDto } from '../dto/get-user-response.dto';
import { Role } from '../../auth/constants/roles';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async createUser(entity: UserDTO) {
    return await this.userRepo.createUser(entity);
  }

  async deleteUser(userId: string) {
    const user = await this.userRepo.getUser(userId);
    if (!user) {
      throw new NotFoundException(`User not found by id: ${userId}`);
    }
    await this.userRepo.deleteUser(userId);
  }

  async getUser(userId: string) {
    const user = await this.userRepo.getUser(userId);
    if (!user) {
      throw new NotFoundException(`User not found by id: ${userId}`);
    }
    return this.createResponseDto(user);
  }

  async getUsers(userIds: string[]) {
    const users = await Promise.all(
      userIds.map(async (id) => {
        const userFound = await this.userRepo.getUser(id);
        return userFound || null; // Return null if user not found
      }),
    );
    return users.map((user) =>
      user === null ? null : this.createResponseDto(user),
    );
  }

  async findUsersByClub(club: string) {
    const users = await this.userRepo.findUsersByClub(club);
    if (!users || users.length === 0) {
      return [];
    }
    return users.map((user) => user._id);
  }

  async getUserbyEmail(email: string) {
    const user = await this.userRepo.getUserByEmail(email);
    return user;
  }

  async getUserRole(userId: string, role: Role) {
    const user = await this.userRepo.getUser(userId);
    if (!user) {
      throw new NotFoundException(`User not found by id: ${userId}`);
    }
    return user.role === role;
  }

  createResponseDto(user) {
    const userResponse = new GetUserResponseDto();
    userResponse.firstName = user.firstName;
    userResponse.lastName = user.lastName;
    userResponse.userId = user._id;
    userResponse.email = user.email;
    userResponse.club = user.club;
    return userResponse;
  }
}
