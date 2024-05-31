import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { UserDTO } from '../dto/user.dto';
import { GetUserResponseDto } from '../dto/get-user-response.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async createUser(entity: UserDTO) {
    await this.userRepo.createUser(entity);
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

  async getUsers() {
    const users = await this.userRepo.getUsers();
    if (!users || users.length === 0) {
      return [];
    }
    return users.map((user) => this.createResponseDto(user));
  }

  async findUsersByClub(club: string) {
    const users = await this.userRepo.findUsersByClub(club);
    if (!users || users.length === 0) {
      return [];
    }
    return users.map((user) => user.userId);
  }

  createResponseDto(user) {
    const userResponse = new GetUserResponseDto();
    userResponse.firstName = user.firstName;
    userResponse.lastName = user.lastName;
    userResponse.userId = user.userId;
    return userResponse;
  }
}
