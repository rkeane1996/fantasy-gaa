import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTeamDTO } from '../dto/create-team.dto';
import { TeamTransferDTO } from '../dto/team-transfer.dto';
import { TeamRepository } from '../repository/team.repository';
import { NumberOfPlayerPerCounty } from '../constants/number-players-per-county.constant';
import { GetTeamResponseDto } from '../dto/get-team-dto';
import { Team, TeamPlayer } from '../schema/team.schema';
import { County } from '../../../lib/common/enum/counties';

@Injectable()
export class TeamService {
  constructor(private readonly teamRepo: TeamRepository) {}

  async createTeam(requestdto: CreateTeamDTO) {
    const { id } = await this.teamRepo.createTeam(requestdto);
    return id;
  }

  async transferPlayers(request: TeamTransferDTO) {
    const { playersIn, playersOut, teamId } = request;

    this.validatePlayerCounts(playersIn, playersOut);

    const currentTeam = await this.teamRepo.getTeamByTeamId(teamId);

    this.validatePlayersOut(playersOut, currentTeam);
    this.validatePlayersIn(playersIn, playersOut, currentTeam);
    this.validateTransferBudget(playersIn, playersOut, currentTeam.budget);

    const updatedTeam = await this.teamRepo.transferPlayers(
      teamId,
      playersOut,
      playersIn,
    );

    return this.createDtoResponse(updatedTeam);
  }

  private validatePlayerCounts(
    playersIn: TeamPlayer[],
    playersOut: TeamPlayer[],
  ): void {
    if (playersIn.length !== playersOut.length) {
      throw new HttpException(
        'The number of players being transferred in must be equal to the number of players being transferred out.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private validatePlayersOut(
    playersOut: TeamPlayer[],
    currentTeam: Team,
  ): void {
    playersOut.forEach((playerOut) => {
      if (
        !currentTeam.players.some(
          (player) => player.playerId === playerOut.playerId,
        )
      ) {
        throw new HttpException(
          `Player with ID ${playerOut.playerId} is not part of the current team.`,
          HttpStatus.BAD_REQUEST,
        );
      }
    });
  }

  private validatePlayersIn(
    playersIn: TeamPlayer[],
    playersOut: TeamPlayer[],
    currentTeam: Team,
  ): void {
    // Create a new array excluding players that are being transferred out
    const currentTeamWithoutPlayersOut = currentTeam.players.filter(
      (player) =>
        !playersOut.some((outPlayer) => outPlayer.playerId === player.playerId),
    );

    // Combine the remaining current team with the incoming players
    const updatedTeam = [...currentTeamWithoutPlayersOut, ...playersIn];

    // Get the available counties
    const counties: County[] = Object.values(County);

    // Validate player count per county
    counties.forEach((county) => {
      const playersFromCounty = updatedTeam.filter(
        (player) => player.county === county,
      );
      if (playersFromCounty.length > NumberOfPlayerPerCounty) {
        throw new HttpException(
          `Cannot add player from ${county}. Maximum of ${NumberOfPlayerPerCounty} players from ${county} allowed.`,
          HttpStatus.BAD_REQUEST,
        );
      }
    });
  }

  private validateTransferBudget(
    playersIn: TeamPlayer[],
    playersOut: TeamPlayer[],
    teamBudget: number,
  ): void {
    const totalPriceForPlayersOut = playersOut.reduce(
      (sum, player) => sum + player.price,
      0,
    );
    const totalPriceForPlayersIn = playersIn.reduce(
      (sum, player) => sum + player.price,
      0,
    );

    if (totalPriceForPlayersIn > totalPriceForPlayersOut + teamBudget) {
      throw new HttpException(
        'Not enough budget to carry out this transfer.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getTeamByUserId(userId: string) {
    const team = await this.teamRepo.getTeamByUserId(userId);
    if (!team) {
      throw new NotFoundException(`Team no found by user id : ${userId}`);
    }
    return this.createDtoResponse(team);
  }

  async getTeamByTeamId(teamId: string) {
    const team = await this.teamRepo.getTeamByTeamId(teamId);
    if (!team) {
      throw new NotFoundException(`Team no found by team id : ${teamId}`);
    }
    return this.createDtoResponse(team);
  }

  async getTeamByPlayerId(playerId: string) {
    const teams = await this.teamRepo.getTeamByPlayerId(playerId);
    return teams.map((team) => this.createDtoResponse(team));
  }

  async updatePoints(
    teamId: string,
    gameweekNumber: number,
    gamweekPoints: number,
  ) {
    const team = await this.teamRepo.updatePoints(
      teamId,
      gameweekNumber,
      gamweekPoints,
    );
    return this.createDtoResponse(team);
  }

  createDtoResponse(t: Team) {
    const team = new GetTeamResponseDto();
    team.teamId = t._id;
    team.userId = t.userId;
    team.teamName = t.teamName;
    team.players = t.players;
    team.gameweekPoints = t.gameweek;
    team.totalPoints = t.totalPoints;
    return team;
  }
}
