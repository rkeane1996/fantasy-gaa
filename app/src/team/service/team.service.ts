import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTeamDTO } from '../dto/create-team.dto';
import { TeamTransferDTO } from '../dto/team-transfer.dto';
import { NumberOfPlayerPerCounty } from '../constants/number-players-per-county.constant';
import { GetTeamResponseDto } from '../dto/get-team-dto';
import { County } from '../../../lib/common/enum/counties';
import { TeamRepository } from '../../../lib/team/repository/team.repository';
import { Team } from '../../../lib/team/schema/team.schema';
import { EditTeamInfoDto } from '../dto/edit-team-dto';
import { TeamPlayer } from '../../../lib/team/schema/teamPlayer.entity';

@Injectable()
export class TeamService {
  constructor(private readonly teamRepository: TeamRepository) {}

  async createTeam(createTeamDto: CreateTeamDTO) {
    const team = await this.teamRepository.createTeam(createTeamDto);
    return team.id;
  }

  async transferPlayers(teamTransferDto: TeamTransferDTO) {
    const { playersToAdd, playersToReplace, teamId } = teamTransferDto;

    const currentTeam = await this.teamRepository.findTeamByTeamId(teamId);

    this.validatePlayerCounts(playersToAdd, playersToReplace);
    this.validatePlayersOut(playersToReplace, currentTeam);
    this.validatePlayersIn(playersToAdd, playersToReplace, currentTeam);
    const newBudget = this.validateTransferBudget(
      playersToAdd,
      playersToReplace,
      currentTeam.budget,
    );

    const updatedTeam = await this.teamRepository.swapPlayersInTeam(
      teamId,
      playersToAdd,
      playersToReplace,
      newBudget,
    );

    return this.createDtoResponse(updatedTeam);
  }

  async getTeamByUserId(userId: string) {
    const team = await this.teamRepository.findTeamByUserId(userId);
    if (!team) {
      throw new NotFoundException(`Team not found by user id : ${userId}`);
    }
    return this.createDtoResponse(team);
  }

  async getTeamByTeamId(teamId: string) {
    const team = await this.teamRepository.findTeamByTeamId(teamId);
    if (!team) {
      throw new NotFoundException(`Team not found by team id : ${teamId}`);
    }
    return this.createDtoResponse(team);
  }

  async updateTeamInfo(editTeamInfo: EditTeamInfoDto) {
    const updatedTeam = await this.teamRepository.editTeam(editTeamInfo);
    return this.createDtoResponse(updatedTeam);
  }

  private validatePlayerCounts(
    playersIn: TeamPlayer[],
    playersOut: TeamPlayer[],
  ): void {
    if (playersIn.length !== playersOut.length) {
      throw new BadRequestException(
        'The number of players being transferred in must be equal to the number of players being transferred out.',
      );
    }
  }

  private validatePlayersOut(
    playersToReplace: TeamPlayer[],
    currentTeam: Team,
  ): void {
    const teamPlayerIds = currentTeam.players.map((player) => player.playerId);

    const invalidPlayers = playersToReplace.filter(
      (playerToReplace) => !teamPlayerIds.includes(playerToReplace.playerId),
    );

    if (invalidPlayers.length > 0) {
      const invalidIds = invalidPlayers
        .map((player) => player.playerId)
        .join(', ');
      throw new BadRequestException(
        `Players with the following IDs are not part of the current team: ${invalidIds}.`,
      );
    }
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
        throw new BadRequestException(
          `Cannot add player from ${county}. Maximum of ${NumberOfPlayerPerCounty} players from ${county} allowed.`,
        );
      }
    });
  }

  private validateTransferBudget(
    playersIn: TeamPlayer[],
    playersOut: TeamPlayer[],
    teamBudget: number,
  ): number {
    const totalPriceForPlayersOut = playersOut.reduce(
      (sum, player) => sum + player.price,
      0,
    );
    const totalPriceForPlayersIn = playersIn.reduce(
      (sum, player) => sum + player.price,
      0,
    );

    if (totalPriceForPlayersIn > totalPriceForPlayersOut + teamBudget) {
      throw new BadRequestException(
        'Not enough budget to carry out this transfer.',
      );
    }

    const newBudget = parseFloat(
      (teamBudget + totalPriceForPlayersOut - totalPriceForPlayersIn).toFixed(
        2,
      ),
    );
    return newBudget;
  }

  private createDtoResponse(t: Team) {
    const team = new GetTeamResponseDto();
    team.teamId = t.id;
    team.userId = t.userId;
    team.teamInfo = t.teamInfo;
    team.players = t.players;
    team.budget = t.budget;
    team.totalPoints = t.totalPoints;
    team.transfers = t.transfers;
    return team;
  }
}
