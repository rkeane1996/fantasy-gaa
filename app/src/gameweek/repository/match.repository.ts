import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMatchDto } from '../dto/request/create-match.dto';
import { Match } from '../schema/match.schema';

export class MatchRepository {
  constructor(
    @InjectModel(Match.name, process.env.FANTASY_GAA_DB_CONNECTION_NAME)
    private readonly matchModel: Model<Match>,
  ) {}

  async addMatch(entity: CreateMatchDto): Promise<Match> {
    return await this.matchModel.create(entity);
  }

  async getMatch(matchId: string): Promise<Match> {
    return await this.matchModel.find({ _id: matchId }).lean();
  }

  async getGameweekMatches(gameweek: number): Promise<Match[]> {
    return await this.matchModel.find({ gameweek: gameweek }).lean();
  }

  async updateMatchScore(
    matchId: string,
    homeScore: string,
    awayScore: string,
  ): Promise<Match> {
    return await this.matchModel.findOneAndUpdate(
      { _id: matchId },
      {
        $set: {
          homeScore: homeScore,
          awayScore: awayScore,
        },
      },
      { new: true },
    );
  }

  // async updatePlayerPoints(
  //   playerId: string,
  //   matchId: string,
  //   points: Points[],
  // ): Promise<Match> {
  //   return this.matchModel.findOneAndUpdate(
  //     { _id: matchId, 'players.playerId': playerId },
  //     {
  //       $set: {
  //         'players.$.points': points,
  //       },
  //     },
  //     { new: true },
  //   );
  // }
}
