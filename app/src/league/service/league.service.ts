import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLeagueDto } from '../dto/request/create-league.dto';
import { JoinLeagueDto } from '../dto/request/join-league.dto';
import { LeagueRepository } from '../repository/league.repository';
import { CreateLeagueResponseDto } from '../dto/response/create-league-response.dto';
import { GetLeagueResponseDto } from '../dto/response/get-league-reponse.dto';

@Injectable()
export class LeagueService {
  constructor(private readonly leagueRepo: LeagueRepository) {}

  async createLeague(request: CreateLeagueDto) {
    const { leagueid } = await this.leagueRepo.createLeague(request);
    return new CreateLeagueResponseDto({ id: leagueid });
  }

  async joinLeague(request: JoinLeagueDto) {
    await this.leagueRepo.joinLeague(request);
    return HttpStatus.CREATED;
  }

  async getLeagues() {
    const leagues = await this.leagueRepo.findAllLeagues();
    return leagues.map((league) => new GetLeagueResponseDto(league));
  }

  async getLeague(leagueId: string) {
    const league = await this.leagueRepo.findLeague(leagueId);
    if (!league) {
      throw new NotFoundException(`League not found`);
    }
    return new GetLeagueResponseDto(league);
  }

  async getTeamsInLeague(leagueId: string) {
    const teamsInLeague = await this.leagueRepo.findTeamsInLeague(leagueId);
    if (!teamsInLeague || teamsInLeague.length === 0) {
      return [];
    }
    return teamsInLeague;
  }

  async getUsersInLeague(leagueId: string) {
    const usersInLeague = await this.leagueRepo.findUsersInLeague(leagueId);
    if (!usersInLeague || usersInLeague.length === 0) {
      return [];
    }
    return usersInLeague;
  }
}
