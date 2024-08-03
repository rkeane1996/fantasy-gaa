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

@Injectable()
export class TeamService {
  constructor(private readonly teamRepo: TeamRepository) {}

  async createTeam(requestdto: CreateTeamDTO) {
    await this.teamRepo.createTeam(requestdto);
    return HttpStatus.CREATED;
  }

  async transferPlayers(request: TeamTransferDTO) {
    const playersIn = request.playersIn;
    const playersOut = request.playersOut;

    if (playersIn.length != playersOut.length) {
      throw new HttpException(
        'Number of players being transferred in must be equal to number of players being transferred out.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const teamPlayers = await this.teamRepo.findPlayersOnTeam(request.teamId);

    playersOut.forEach((player) => {
      const playerIsOnTeam = teamPlayers.find(
        (currentPlayerId) => currentPlayerId.playerId === player.playerId,
      );
      if (!playerIsOnTeam) {
        throw new HttpException(
          'Player that is being transferred out, is not part of current team',
          HttpStatus.BAD_REQUEST,
        );
      }
    });

    playersIn.forEach((player) => {
      const playersFromSameCounty = teamPlayers.filter(
        (currentPlayer) => currentPlayer.county === player.county,
      );
      if (playersFromSameCounty.length === NumberOfPlayerPerCounty) {
        throw new HttpException(
          `Too many players from the same county. Max ${NumberOfPlayerPerCounty} players per county`,
          HttpStatus.BAD_REQUEST,
        );
      }
    });

    await this.teamRepo.transferPlayers(playersOut, playersIn);
    const updatedTeam = await this.teamRepo.getTeamByTeamId(request.teamId);
    return this.createDtoResponse(updatedTeam);
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

  createDtoResponse(t) {
    const team = new GetTeamResponseDto();
    team.teamId = t.teamId;
    team.userId = t.userId;
    team.teamName = t.teamName;
    team.players = t.players;
    return team;
  }
}
