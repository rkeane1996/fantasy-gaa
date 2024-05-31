import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { JoinLeagueDto } from '../dto/request/join-league.dto';
import { CreateLeagueDto } from '../dto/request/create-league.dto';
import { LeagueService } from '../service/league.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateLeagueResponseDto } from '../dto/response/create-league-response.dto';
import { GetLeagueResponseDto } from '../dto/response/get-league-reponse.dto';

@Controller('league')
@ApiTags('league')
export class LeagueController {
  constructor(private readonly leagueService: LeagueService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a league' })
  @ApiResponse({
    status: 201,
    description: 'League is created',
    type: CreateLeagueResponseDto,
  })
  async createLeague(
    @Body() request: CreateLeagueDto,
  ): Promise<CreateLeagueResponseDto> {
    return await this.leagueService.createLeague(request);
  }

  @Post('join')
  @ApiOperation({ summary: 'Join a league' })
  @ApiResponse({
    status: 201,
    description: 'Team joined league',
  })
  async joinLeague(@Body() request: JoinLeagueDto) {
    return await this.leagueService.joinLeague(request);
  }

  @Get('')
  @ApiOperation({ summary: 'Get all leagues' })
  @ApiResponse({
    status: 200,
    type: [GetLeagueResponseDto],
  })
  async getLeagues(): Promise<GetLeagueResponseDto[]> {
    return await this.leagueService.getLeagues();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get specific league' })
  @ApiResponse({
    status: 200,
    type: GetLeagueResponseDto,
  })
  async getLeague(
    @Param('id') leagueId: string,
  ): Promise<GetLeagueResponseDto> {
    return await this.leagueService.getLeague(leagueId);
  }

  @Get(':id/teams')
  @ApiOperation({ summary: 'Gets team id that are in a specific league' })
  @ApiResponse({
    status: 200,
    type: [String],
  })
  async getTeamsInLeague(@Param('id') leagueId: string): Promise<string[]> {
    return await this.leagueService.getTeamsInLeague(leagueId);
  }

  @Get(':id/users')
  @ApiOperation({ summary: 'Gets user ids that are in a specific league' })
  @ApiResponse({
    status: 200,
    type: [String],
  })
  async getUsersInLeague(@Param('id') leagueId: string): Promise<string[]> {
    return await this.leagueService.getUsersInLeague(leagueId);
  }
}
