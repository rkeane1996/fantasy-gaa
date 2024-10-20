import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Team, TeamDocument } from '../schema/team.schema';
import { CreateTeamDTO } from '../../../src/team/dto/create-team.dto';
import { EditTeamInfoDto } from '../../../src/team/dto/edit-team-dto';
import { TeamPlayer } from '../schema/teamPlayer.entity';

export class TeamRepository {
  constructor(
    @InjectModel(Team.name, process.env.FANTASY_GAA_DB_CONNECTION_NAME)
    private readonly teamModel: Model<TeamDocument>,
  ) {}

  async findTeamByTeamId(teamId: string): Promise<Team> {
    return (await this.teamModel.findOne({ _id: teamId })).toJSON();
  }

  async findTeamByUserId(userId: string): Promise<Team> {
    return (await this.teamModel.findOne({ userId: userId })).toJSON();
  }

  async createTeam(createTeamDto: CreateTeamDTO): Promise<Team> {
    const team = new this.teamModel(createTeamDto);
    await team.save();
    return team.toJSON();
  }

  async editTeam(editTeamDto: EditTeamInfoDto): Promise<Team> {
    return await this.teamModel.findOneAndUpdate(
      { _id: editTeamDto.teamId },
      {
        $set: {
          teamInfo: {
            teamName: editTeamDto.teamName,
            jerseyColour: editTeamDto.jerseyColour,
            shortsColour: editTeamDto.shortsColour,
          },
        },
      },
      { new: true },
    );
  }

  async swapPlayersInTeam(
    teamId: string,
    playersToAdd: TeamPlayer[],
    playersToReplace: TeamPlayer[],
    updatedBudget: number,
  ) {
    await this.teamModel.findOneAndUpdate(
      { _id: teamId },
      {
        $pullAll: { players: playersToReplace },
      },
    );

    return await this.teamModel.findOneAndUpdate(
      { _id: teamId },
      {
        $addToSet: { players: { $each: playersToAdd } },
        $set: { budget: updatedBudget },
      },
      { new: true },
    );
  }

  async addTotalPoints(teamId: string, points: number) {
    await this.teamModel.findByIdAndUpdate(teamId, {
      $set: { totalPoints: points },
    });
  }
}
