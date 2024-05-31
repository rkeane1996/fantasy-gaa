import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Team, TeamDocument } from '../schema/team.schema';
import { CreateTeamDTO } from '../dto/create-team.dto';
import { TeamPlayer } from '../dto/team-transfer.dto';
import { AddPointsDTO } from 'lib/common/dto/request/add-points.dto';

export class TeamRepository {
  constructor(
    @InjectModel(Team.name)
    private readonly teamModel: Model<TeamDocument>,
  ) {}

  async createTeam(entity: CreateTeamDTO) {
    return await this.teamModel.create({ ...entity });
  }

  async findPlayersOnTeam(teamId: string): Promise<string[]> {
    return await this.teamModel.find({ teamId }).select('players').lean();
  }

  async getTeamByUserId(userId: string) {
    return await this.teamModel.findOne({ userId: userId });
  }

  async getTeamByTeamId(teamId: string) {
    return await this.teamModel.findOne({ teamId });
  }

  async transferPlayers(playerOut: TeamPlayer[], playersIn: TeamPlayer[]) {
    for (let i = 0; i < playerOut.length; i++) {
      const record1 = playerOut[i];
      const record2 = playersIn[i];

      // Find and replace the record
      const result = await this.teamModel
        .replaceOne(
          { 'players.player.playerId': record1.playerId }, // Find the document by playerid from array1
          record2, // Replace with the document from array2
        )
        .exec();

      console.log(`Replaced record with _id: ${record1.playerId}`, result);
    }
  }

  async addPoints(entity: AddPointsDTO) {
    return await this.teamModel.updateOne(
      { teamId: entity.id },
      {
        $push: { gameweekPoints: entity.points },
        $inc: { totalPoints: entity.points.gameweekPoints },
      },
    );
  }
}
