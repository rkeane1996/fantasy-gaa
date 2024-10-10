import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLeagueDto } from '../dto/request/create-league.dto';
import { JoinLeagueDto } from '../dto/request/join-league.dto';

import { GetLeagueResponseDto } from '../dto/response/get-league-reponse.dto';
import { plainToInstance } from 'class-transformer';
import { LeagueRepository } from '../../../lib/league/repository/league.repository';

@Injectable()
export class LeagueService {
  constructor(private readonly leagueRepository: LeagueRepository) {}

  async createLeague(createLeagueDto: CreateLeagueDto) {
    const newLeague = await this.leagueRepository.createLeague(createLeagueDto);
    return newLeague;
  }

  async joinLeague(joinLeagueDto: JoinLeagueDto) {
    const league = await this.leagueRepository.findLeagueByCode(
      joinLeagueDto.leagueCode,
    );
    if (!league) {
      throw new NotFoundException(
        `League with code ${joinLeagueDto.leagueCode} does not exist`,
      );
    }
    const updatedLeague = await this.leagueRepository.joinLeague(joinLeagueDto);
    return plainToInstance(GetLeagueResponseDto, updatedLeague);
  }

  async getLeague(leagueId: string) {
    const league = await this.leagueRepository.findLeague(leagueId);
    if (!league) {
      throw new NotFoundException(`League not found`);
    }
    return plainToInstance(GetLeagueResponseDto, league);
  }

  async getTeamsInLeague(leagueId: string) {
    const teamsInLeague =
      await this.leagueRepository.findTeamsInLeague(leagueId);
    if (!teamsInLeague || teamsInLeague.length === 0) {
      return [];
    }
    return teamsInLeague;
  }
}
