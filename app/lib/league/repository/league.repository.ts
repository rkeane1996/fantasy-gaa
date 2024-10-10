import { InjectModel } from '@nestjs/mongoose';
import { League, LeagueDocument } from '../schema/league.schema';
import { Model } from 'mongoose';
import { CreateLeagueDto } from '../../../src/league/dto/request/create-league.dto';
import { JoinLeagueDto } from '../../../src/league/dto/request/join-league.dto';
import { Team } from '../../../lib/team/schema/team.schema';

export class LeagueRepository {
  constructor(
    @InjectModel(League.name, process.env.FANTASY_GAA_DB_CONNECTION_NAME)
    private readonly leagueModel: Model<LeagueDocument>,
  ) {}

  async createLeague(entity: CreateLeagueDto): Promise<League> {
    const newLeague = new this.leagueModel(entity);
    await newLeague.save();
    return newLeague.toJSON();
  }

  async joinLeague(entity: JoinLeagueDto): Promise<League> {
    return (
      await this.leagueModel.findOneAndUpdate(
        { leagueCode: entity.leagueCode },
        {
          $addToSet: {
            teams: entity.teamId,
          },
        },
        { new: true },
      )
    ).toJSON();
  }

  async findLeague(leagueId: string): Promise<League> {
    return (await this.leagueModel.findOne({ _id: leagueId })).toJSON();
  }

  async findLeagueByCode(code: string): Promise<League> {
    return (await this.leagueModel.findOne({ leagueCode: code })).toJSON();
  }

  async findTeamsInLeague(leagueId: string): Promise<Team[]> {
    const league = (
      await this.leagueModel.findOne({ _id: leagueId }).populate('teams')
    ).toJSON();
    return league.teams;
  }
}
