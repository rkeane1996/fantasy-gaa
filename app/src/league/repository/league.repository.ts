import { InjectModel } from '@nestjs/mongoose';
import { CreateLeagueDto } from '../dto/request/create-league.dto';
import { JoinLeagueDto } from '../dto/request/join-league.dto';
import { League } from '../schema/league.schema';
import { Model } from 'mongoose';

export class LeagueRepository {
  constructor(
    @InjectModel(League.name, process.env.FANTASY_GAA_DB_CONNECTION_NAME)
    private readonly leagueModel: Model<League>,
  ) {}

  async createLeague(entity: CreateLeagueDto): Promise<League> {
    return await this.leagueModel.create(entity);
  }

  async joinLeague(entity: JoinLeagueDto): Promise<League> {
    return await this.leagueModel
      .findOneAndUpdate(
        { leagueCode: entity.leagueCode },
        {
          $addToSet: {
            teams: entity.teamId,
          },
        },
        { new: true },
      )
      .lean();
  }

  async findAllLeagues(): Promise<League[]> {
    return await this.leagueModel.find().lean();
  }

  async findLeague(leagueId: string): Promise<League> {
    return await this.leagueModel.findOne({ _id: leagueId }).lean();
  }

  async findLeagueByCode(code: string): Promise<League> {
    return await this.leagueModel.findOne({ leagueCode: code }).lean();
  }

  async findTeamsInLeague(leagueId: string): Promise<string[]> {
    return await this.leagueModel
      .find({ _id: leagueId })
      .select('teams')
      .lean();
  }
}
