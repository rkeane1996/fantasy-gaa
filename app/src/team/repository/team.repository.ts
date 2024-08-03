import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Team, TeamDocument } from '../schema/team.schema';
import { CreateTeamDTO } from '../dto/create-team.dto';
import { TeamPlayer } from '../dto/team-transfer.dto';
import { ITeam } from '../interface/team.interface';

export class TeamRepository {
  constructor(
    @InjectModel(Team.name, process.env.FANTASY_GAA_DB_CONNECTION_NAME)
    private readonly teamModel: Model<TeamDocument>,
  ) {}

  async createTeam(entity: CreateTeamDTO) {
    return await this.teamModel.create({ ...entity });
  }

  async findPlayersOnTeam(teamId: string): Promise<TeamPlayer[]> {
    return await this.teamModel.find({ teamId }).select('players').lean();
  }

  async getTeamByUserId(userId: string): Promise<ITeam> {
    return await this.teamModel.findOne({ userId: userId });
  }

  async getTeamByTeamId(teamId: string): Promise<ITeam> {
    return await this.teamModel.findOne({ teamId });
  }

  async transferPlayers(playerOut: TeamPlayer[], playersIn: TeamPlayer[]) {
    for (let i = 0; i < playerOut.length; i++) {
      const subOut = playerOut[i];
      const subIn = playersIn[i];

      // Find and replace the record
      const result = await this.teamModel
        .replaceOne(
          { 'players.player.playerId': subOut.playerId }, // Find the document by playerid from array1
          subIn, // Replace with the document from array2
        )
        .exec();

      console.log(`Replaced record with _id: ${subOut.playerId}`, result);
    }
  }
}
