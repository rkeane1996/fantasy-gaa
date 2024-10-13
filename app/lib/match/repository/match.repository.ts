import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Match, MatchDocument } from '../schema/match.schema';
import { CreateMatchDto } from '../../../src/match/dto/create-match.dto';
import { PlayerPerformance } from '../schema/player-performance';
import { PlayerPerformanceDto } from 'src/match/dto/player-performance.dto';

export class MatchRepository {
  constructor(
    @InjectModel(Match.name, process.env.FANTASY_GAA_DB_CONNECTION_NAME)
    private readonly matchModel: Model<MatchDocument>,
  ) {}

  async createMatch(entity: CreateMatchDto): Promise<Match> {
    const match = new this.matchModel(entity);
    await match.save();
    return match.toJSON();
  }

  async findMatch(matchId: string): Promise<Match> {
    return (await this.matchModel.findById(matchId)).toJSON();
  }

  async updateMatchScore(
    matchId: string,
    homeScore: string,
    awayScore: string,
  ): Promise<Match> {
    return (
      await this.matchModel.findByIdAndUpdate(
        matchId,
        {
          $set: {
            homeScore: homeScore,
            awayScore: awayScore,
          },
        },
        { new: true },
      )
    ).toJSON();
  }

  async findMatchPlayers(matchId: string): Promise<PlayerPerformance[]> {
    const match = (
      await this.matchModel.findById(matchId).populate({
        path: 'playerPerformance.playerId', // Path to the nested playerId field in playerPerformance
        model: 'Player', // Model to populate
      })
    ).toJSON();
    return match.playerPerformance;
  }

  async updatePlayerPerformance(
    matchId: string,
    player: PlayerPerformanceDto,
  ): Promise<Match> {
    return await this.matchModel.findOneAndUpdate(
      { _id: matchId, 'playerPerformance.playerId': player.playerId },
      {
        $set: {
          'playerPerformance.$.goals': player.goals,
          'playerPerformance.$.points': player.points,
          'playerPerformance.$.yellowCards': player.yellowCards,
          'playerPerformance.$.redCards': player.redCards,
          'playerPerformance.$.minutes': player.minutes,
          'playerPerformance.$.saves': player.saves,
          'playerPerformance.$.penaltySaves': player.penaltySaves,
          'playerPerformance.$.hooks': player.hooks,
          'playerPerformance.$.blocks': player.blocks,
          'playerPerformance.$.totalPoints': player.totalPoints,
        },
      },
      { new: true },
    );
  }
}
