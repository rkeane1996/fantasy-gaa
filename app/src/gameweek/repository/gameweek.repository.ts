import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateGameweekDto } from '../dto/request/create-gameweek.dto';
import { Gameweek } from '../schema/gameweek.schema';

export class GameweekRepository {
  constructor(
    @InjectModel(Gameweek.name, process.env.FANTASY_GAA_DB_CONNECTION_NAME)
    private readonly gameweekModel: Model<Gameweek>,
  ) {}

  async createGameWeek(entity: CreateGameweekDto): Promise<Gameweek> {
    return await this.gameweekModel.create(entity);
  }

  async getGameWeeks(): Promise<Gameweek[]> {
    return await this.gameweekModel.find().lean();
  }

  async getGameWeek(gameweekNumber: number): Promise<Gameweek> {
    return await this.gameweekModel
      .findOne({ gameweekNumber: gameweekNumber })
      .lean();
  }

  async startEndGameweek(
    gameweekNumber: number,
    isActive: boolean,
  ): Promise<Gameweek> {
    return await this.gameweekModel.findOneAndUpdate(
      { gameweekNumber: gameweekNumber },
      {
        $set: {
          isActive: isActive,
        },
      },
      { returnDocument: 'after' },
    );
  }

  async addMatchToGameweek(matchIds: string, gameweekNumber: number) {
    return await this.gameweekModel.findOneAndUpdate(
      { gameweekNumber: gameweekNumber },
      {
        $addToSet: {
          matches: matchIds,
        },
      },
      { new: true },
    );
  }
}
