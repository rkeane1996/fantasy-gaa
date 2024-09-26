import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLeagueDto } from '../dto/request/create-league.dto';
import { JoinLeagueDto } from '../dto/request/join-league.dto';
import { LeagueRepository } from '../repository/league.repository';
import { GetLeagueResponseDto } from '../dto/response/get-league-reponse.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class LeagueService {
  constructor(private readonly leagueRepo: LeagueRepository) {}

  async createLeague(request: CreateLeagueDto) {
    const newLeague = await this.leagueRepo.createLeague(request);
    return plainToInstance(GetLeagueResponseDto, { newLeague });
  }

  async joinLeague(request: JoinLeagueDto) {
    const league = await this.leagueRepo.findLeagueByCode(request.leagueCode);
    if (!league) {
      throw new NotFoundException(
        `League with code ${request.leagueCode} does not exist`,
      );
    }
    const updatedLeague = await this.leagueRepo.joinLeague(request);
    return plainToInstance(GetLeagueResponseDto, updatedLeague);
  }

  async getLeagues() {
    const leagues = await this.leagueRepo.findAllLeagues();
    return leagues.map((league) =>
      plainToInstance(GetLeagueResponseDto, league),
    );
  }

  async getLeague(leagueId: string) {
    const league = await this.leagueRepo.findLeague(leagueId);
    if (!league) {
      throw new NotFoundException(`League not found`);
    }
    return plainToInstance(GetLeagueResponseDto, league);
  }

  async getTeamsInLeague(leagueId: string) {
    const teamsInLeague = await this.leagueRepo.findTeamsInLeague(leagueId);
    if (!teamsInLeague || teamsInLeague.length === 0) {
      return [];
    }
    return teamsInLeague;
  }
}
