import { InjectModel } from '@nestjs/mongoose';
import { CreateLeagueDto } from '../dto/request/create-league.dto';
import { JoinLeagueDto } from '../dto/request/join-league.dto';
import { League, LeagueDocument } from '../schema/league.schema';
import { Model } from 'mongoose';

export class LeagueRepository {
  constructor(
    @InjectModel(League.name)
    private readonly leagueModel: Model<LeagueDocument>,
  ) {}

  async createLeague(entity: CreateLeagueDto): Promise<League> {
    return await this.leagueModel.create(entity);
  }

  async joinLeague(entity: JoinLeagueDto): Promise<League> {
    return await this.leagueModel
      .findOneAndUpdate(
        { leagueid: entity.leagueId },
        {
          $push: {
            teams: entity.teamId,
            users: entity.userId,
          },
        },
      )
      .lean();
  }

  async findAllLeagues(): Promise<League[]> {
    return await this.leagueModel.find().lean();
  }

  async findLeague(leagueId: string): Promise<League> {
    return await this.leagueModel.findOne({ leagueid: leagueId }).lean();
  }

  async findTeamsInLeague(leagueId: string): Promise<string[]> {
    return await this.leagueModel
      .find({ leagueid: leagueId })
      .select('teams')
      .lean();
  }

  async findUsersInLeague(leagueId: string): Promise<string[]> {
    return await this.leagueModel
      .find({ leagueid: leagueId })
      .select('users')
      .lean();
  }
}
