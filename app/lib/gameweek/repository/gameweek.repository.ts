import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Gameweek, GameweekDocument } from '../schema/gameweek.schema';
import { GameweekTeam } from '../schema/gameweek.team.schema';
import { Match } from '../../../lib/match/schema/match.schema';
import { CreateGameweekDto } from '../../../src/gameweek/dto/request/create-gameweek.dto';
import { Player } from '../../../lib/player/schema/player.schema';
import { Team } from '../../../lib/team/schema/team.schema';

export class GameweekRepository {
  constructor(
    @InjectModel(Gameweek.name, process.env.FANTASY_GAA_DB_CONNECTION_NAME)
    private readonly gameweekModel: Model<GameweekDocument>,
  ) {}

  async createGameWeek(entity: CreateGameweekDto): Promise<Gameweek> {
    const gameweek = new this.gameweekModel(entity);
    await gameweek.save();
    return gameweek.toJSON();
  }

  async addMatchesToGameweek(
    gameweekNumber: number,
    matchIds: string[],
  ): Promise<Gameweek> {
    return (
      await this.gameweekModel.findOneAndUpdate(
        { gameweekNumber: gameweekNumber },
        {
          $addToSet: {
            matches: { $each: matchIds },
          },
        },
        { new: true },
      )
    ).toJSON();
  }

  async addTeamsToGameweek(
    gameweekNumber: number,
    gameweekTeams: GameweekTeam[],
  ): Promise<Gameweek> {
    return (
      await this.gameweekModel.findOneAndUpdate(
        { gameweekNumber: gameweekNumber },
        {
          $addToSet: {
            gameweekTeams: { $each: gameweekTeams },
          },
        },
        { new: true },
      )
    ).toJSON();
  }

  async getGameWeek(gameweekNumber: number): Promise<Gameweek> {
    return (
      await this.gameweekModel.findOne({ gameweekNumber: gameweekNumber })
    ).toJSON();
  }

  async getGameweekMatches(gameweekNumber: number): Promise<Match[]> {
    const gameweek = await this.gameweekModel
      .findOne({ gameweekNumber: gameweekNumber })
      .populate('matches');
    return gameweek.matches;
  }

  async getGameweekMatch(
    gameweekNumber: number,
    matchId: string,
  ): Promise<Match> {
    const matches = await this.getGameweekMatches(gameweekNumber);
    return matches.find((match) => match.id === matchId);
  }

  async getGameweekTeam(
    gameweekNumber: number,
    teamId: string,
  ): Promise<GameweekTeam> {
    const gameweek = await this.gameweekModel
      .findOne({
        gameweekNumber: gameweekNumber,
        'gameweekTeams.teamId': teamId,
      })
      .populate({
        path: 'gameweekTeams.teamPlayers.playerId',
        model: Player.name,
      });
    return gameweek.gameweekTeams[0];
  }

  async getGameweekTeams(gameweekNumber: number): Promise<GameweekTeam[]> {
    const gameweek = await this.gameweekModel
      .findOne({ gameweekNumber: gameweekNumber })
      .populate({
        path: 'gameweekTeams.teamPlayers.playerId',
        model: Player.name,
      })
      .populate({
        path: 'gameweekTeams.teamId',
        model: Team.name,
      });
    return gameweek.gameweekTeams;
  }

  async activateDeactivateGameweek(
    gameweekNumber: number,
    isActive: boolean,
  ): Promise<Gameweek> {
    return (
      await this.gameweekModel.findOneAndUpdate(
        { gameweekNumber: gameweekNumber },
        {
          $set: {
            isActive: isActive,
          },
        },
        { new: true },
      )
    ).toJSON();
  }
}
