import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Team, TeamPlayer } from '../schema/team.schema';
import { CreateTeamDTO } from '../dto/create-team.dto';

export class TeamRepository {
  constructor(
    @InjectModel(Team.name, process.env.FANTASY_GAA_DB_CONNECTION_NAME)
    private readonly teamModel: Model<Team>,
  ) {}

  async createTeam(entity: CreateTeamDTO) {
    return await this.teamModel.create({ ...entity });
  }

  async findPlayersOnTeam(teamId: string): Promise<TeamPlayer[]> {
    return await this.teamModel.find({ _id: teamId }).select('players').lean();
  }

  async getTeamByUserId(userId: string): Promise<Team> {
    return await this.teamModel.findOne({ userId: userId });
  }

  async getTeamByTeamId(teamId: string): Promise<Team> {
    return await this.teamModel.findOne({ _id: teamId });
  }

  async getTeamByPlayerId(playerId: string): Promise<Team[]> {
    return await this.teamModel.find({ 'players.playerId': playerId });
  }

  async transferPlayers(
    teamId: string,
    playerOut: TeamPlayer[],
    playersIn: TeamPlayer[],
  ) {
    let result: Team;
    for (let i = 0; i < playerOut.length; i++) {
      const subOut = playerOut[i];
      const subIn = playersIn[i];

      // Find and replace the record
      await this.teamModel.findOneAndUpdate(
        { _id: teamId },
        {
          // Pull the player you want to remove from the 'players' array
          $pull: { players: { playerId: subOut.playerId } },
        },
        { new: true }, // Return the updated document
      );

      result = await this.teamModel.findOneAndUpdate(
        { _id: teamId },
        {
          // Push the new player object into the 'players' array
          $push: { players: subIn },
        },
        { new: true }, // Return the updated document
      );
    }
    return result;
  }

  async updatePoints(
    teamId: string,
    gameweekNumber: number,
    gameweekPoints: number,
  ) {
    return await this.teamModel.findOneAndUpdate(
      { id: teamId },
      {
        $inc: { totalPoints: gameweekPoints },
        $set: {
          gameweekPoints: {
            gameweek: gameweekNumber,
            points: gameweekPoints,
          },
        },
      },
      { new: true },
    );
  }
}
