import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schema/user.schema';
import { Model } from 'mongoose';
import { UserDTO } from '../dto/user.dto';

export class UserRepository {
  constructor(
    @InjectModel(User.name, process.env.FANTASY_GAA_DB_CONNECTION_NAME)
    private readonly userModel: Model<User>,
  ) {}

  async createUser(entity: UserDTO): Promise<User> {
    return await this.userModel.create(entity);
  }

  async updateUser(userId: string, entity: UserDTO): Promise<User> {
    return await this.userModel
      .findOneAndUpdate(
        { id: userId },
        { $set: entity },
        {
          new: true,
          useFindAndModify: false,
          overwrite: true,
          returnDocument: 'after',
        },
      )
      .lean();
  }

  async deleteUser(userId: string) {
    return await this.userModel.deleteOne({ id: userId }).lean();
  }

  async getUser(id: string): Promise<User | null> {
    return (await this.userModel.findOne({ _id: id }).lean()) || null;
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email }).lean();
  }

  async getUsers(): Promise<User[]> {
    return await this.userModel.find().lean();
  }

  async findUsersByClub(club: string): Promise<User[]> {
    return await this.userModel.find({ 'club.clubName': club }).lean();
  }
}
