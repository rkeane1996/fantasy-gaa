import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schema/user.schema';
import { Model } from 'mongoose';
import { UserDTO } from '../dto/user.dto';

export class UserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(entity: UserDTO) {
    return await this.userModel.create({ ...entity });
  }

  async updateUser(userId: string, entity: UserDTO) {
    return await this.userModel
      .findOneAndUpdate(
        { userId },
        { $set: entity },
        { new: true, useFindAndModify: false, overwrite: true },
      )
      .lean();
  }

  async deleteUser(userId: string) {
    return await this.userModel.deleteOne({ userId: userId }).lean();
  }

  async getUser(userId: string) {
    return await this.userModel.findOne({ userId }).lean();
  }

  async getUserByEmail(email: string) {
    return await this.userModel.findOne({ email }).lean();
  }

  async getUsers() {
    return await this.userModel.find().lean();
  }

  async findUsersByClub(club: string) {
    return await this.userModel.find({ 'club.clubName': club }).lean();
  }
}
