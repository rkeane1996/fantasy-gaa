import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JoinLeagueDto } from '../dto/request/join-league.dto';
import { CreateLeagueDto } from '../dto/request/create-league.dto';
import { LeagueService } from '../service/league.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetLeagueResponseDto } from '../dto/response/get-league-reponse.dto';
import { UserAuthGuard } from '../../auth/guards/user-auth.guard';

@Controller('league')
@ApiTags('league')
@UseGuards(UserAuthGuard)
export class LeagueController {
  constructor(private readonly leagueService: LeagueService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a league' })
  @ApiResponse({
    status: 201,
    description: 'League is created',
    type: GetLeagueResponseDto,
  })
  async createLeague(
    @Body() request: CreateLeagueDto,
  ): Promise<GetLeagueResponseDto> {
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

  @Get('all')
  @ApiOperation({ summary: 'Get all leagues' })
  @ApiResponse({
    status: 200,
    type: [GetLeagueResponseDto],
  })
  async getLeagues(): Promise<GetLeagueResponseDto[]> {
    return await this.leagueService.getLeagues();
  }

  @Get('/')
  @ApiOperation({ summary: 'Get specific league' })
  @ApiResponse({
    status: 200,
    type: GetLeagueResponseDto,
  })
  async getLeague(
    @Query('leagueId') leagueId: string,
  ): Promise<GetLeagueResponseDto> {
    return await this.leagueService.getLeague(leagueId);
  }

  @Get('teams')
  @ApiOperation({ summary: 'Gets team id that are in a specific league' })
  @ApiResponse({
    status: 200,
    type: [String],
  })
  async getTeamsInLeague(
    @Query('leagueId') leagueId: string,
  ): Promise<string[]> {
    return await this.leagueService.getTeamsInLeague(leagueId);
  }
}
